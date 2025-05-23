from config.milvusdb import MilvusDB
from flask import current_app  # type: ignore
from pydantic import create_model  # type: ignore
from collections import defaultdict
from pymilvus import (  # type: ignore
    Status,
    FieldSchema,
    DataType,
    Collection,
    CollectionSchema,
    AnnSearchRequest,
    RRFRanker,
    WeightedRanker,
    MilvusException,
    utility,
)


class Milvus_Handler:

    persistent_collections = []
    pydantic_collections = {}
    themes_descriptions = ""
    filter_bias = 0.4
    k = 4

    def __init__(self, k=4, filter_bias=0.4) -> None:
        try:
            self.search_threshold = (
                current_app.config.get("SEARCH_THRESHOLD") or 1.1
            )  # os.getenv('SEARCH_THRESHOLD', 1.1)
            self.latest_timespan_months = (
                current_app.config.get("LATEST_TIMESPAN_MONTHS") or 5
            )  # os.getenv('LATEST_TIMESPAN_MONTHS', 5)

            milvus_handler = (
                MilvusDB().get_handler()
            )  # connections._fetch_handler('default')

            self.k = k
            self.filter_bias = filter_bias
            self._handler = milvus_handler

            # Create pydantic representation of collections schemas
            collections = milvus_handler.list_collections()
            for col in collections:
                self.update_pydantic_schema(
                    col
                )  # Update pydantic schema for each collection

            # Create descriptions of themes (collections) in the database
            self.update_collection_descriptions()

        except Exception as e:
            raise e

    def update_collection_descriptions(self):
        try:
            descriptions = ""
            for col in self._handler.list_collections():
                result = self.describe_collection(col, alias=True)
                descriptions += f"{result[1]}: {result[0]['description']}\n"

            self.themes_descriptions = descriptions
            return True
        except Exception as e:
            raise Exception("MILVUS_HANDLE.UPDATE_COLLECTION_DESCRIPTION", str(e))

    def update_pydantic_schema(self, collection_name):
        # Update pydantic schema
        try:
            schema = self.get_collection_schema(
                collection_name=collection_name,
                readable=True,
                exclude_metadata=[
                    "created_at",
                    "updated_at",
                    "document_id",
                    "title",
                    "updated_at",
                    "url",
                    "in_effect",
                ],
            )
            fields = {"article": (str, ...), "latest": (bool, ...)}
            for field, attrs in schema.items():
                if attrs["type"] == "int":
                    fields[field] = (int, ...)
                elif attrs["type"] == "float":
                    fields[field] = (float, ...)
                elif attrs["type"] == "string":
                    fields[field] = (str, ...)
                elif attrs["type"] == "list":
                    fields[field] = (list[str], ...)
                elif attrs["type"] == "bool":
                    fields[field] = (bool, ...)
            model = create_model(collection_name, **fields)
            self.pydantic_collections[collection_name] = model
            return True
        except Exception as e:
            raise Exception(f"MILVUS_HANDLE.UPDATE_PYHANTIC_SCHEMA {e}")

    def update_json_schema(self, collection_name):
        schema = self.get_collection_schema(
            collection_name=collection_name,
            readable=True,
            exclude_metadata=[
                "created_at",
                "updated_at",
                "document_id",
                "title",
                "updated_at",
                "url",
                "in_effect",
            ],
        )
        fields = {
            "article": {"type": "string", "description": "The content of the article"},
            "latest": {
                "type": "boolean",
                "description": "Whether the user's question requires the latest articles",
            },
        }
        # TODO
        pass

    def describe_collection(self, collection_name, alias=False):
        if alias:
            collection = Collection(collection_name)
            collection_name = (
                collection.aliases[0]
                if len(collection.aliases) > 0
                else collection_name
            )  # Get alias if it exists
            return collection.describe(), collection_name
        else:
            return Collection(collection_name).describe()

    def get_collection_schema(
        self, collection_name, readable=False, exclude_metadata=[]
    ):
        try:
            schema = Collection(collection_name).describe()["fields"]
            if not readable:
                return schema

            schema_readable = {}

            def convert_type(type):
                if (
                    type == DataType.INT8
                    or type == DataType.INT16
                    or type == DataType.INT32
                    or type == DataType.INT64
                ):
                    return "int"
                elif type == DataType.FLOAT or type == DataType.DOUBLE:
                    return "float"
                elif type == DataType.VARCHAR or type == DataType.STRING:
                    return "string"
                elif type == DataType.ARRAY:
                    return "list"
                else:
                    return "unknown"

            for meta in schema:
                if (
                    meta["name"]
                    in [
                        "id",
                        "embedding",
                        "chunk_id",
                        "article",
                        "is_active",
                        "page_number",
                        "file_links",
                    ]
                    + exclude_metadata
                ):  # Skip these fields
                    continue  # TODO: Fix this to achieve better flexibility in the system
                schema_readable[meta["name"]] = {}

                schema_readable[meta["name"]]["type"] = convert_type(meta["type"])
                if schema_readable[meta["name"]]["type"] == "list":
                    schema_readable[meta["name"]]["element_type"] = convert_type(
                        meta["element_type"]
                    )
                    schema_readable[meta["name"]]["max_size"] = meta["params"][
                        "max_capacity"
                    ]
                elif schema_readable[meta["name"]]["type"] == "string":
                    schema_readable[meta["name"]]["max_length"] = meta["params"][
                        "max_length"
                    ]

                schema_readable[meta["name"]]["description"] = meta["description"]
                schema_readable[meta["name"]]["required"] = False
            if "title" in schema_readable:
                schema_readable["title"]["required"] = True
            return schema_readable
        except Exception as e:
            raise Exception(f"MILVUS_HANDLER.ERR_GET_COLLECTION_SCHEMA {str(e)}")

    def load_collection(self, name, persist=False):
        try:
            if persist:
                self.persistent_collections.append(name)
                collection = Collection(name)
                collection.load()
            else:
                collection = Collection(name)
                collection.load()

            return Status()
        except Exception as e:
            raise Exception(f"MILVUS_HANDLER.LOAD_COLLECTION {str(e)}")

    def similarity_search(
        self,
        collection: str,
        query_embeddings,
        k: int = 4,
        search_params=None,
        output_fields=["title", "article", "url"],
        filters: dict = None,
    ):
        try:
            results = {}
            source = []
            if search_params is None:
                search_params = {"metric_type": "L2", "params": {"nprobe": 5}}
            if filters is None:
                filters = {}
            for c in self.persistent_collections + [
                collection
            ]:  # Search from default collections + currently loaded collection
                search_results = Collection(c).search(
                    data=[query_embeddings],
                    anns_field="embedding",
                    param=search_params,
                    limit=k,
                    expr=filters.get(c, None),
                    output_fields=(
                        output_fields
                        if type(output_fields) == list
                        else output_fields[c]
                    ),  # If the user specified different output fields
                    # for different collections
                )[0]
                for r in search_results:
                    if (
                        r.distance > self.search_threshold
                    ):  # Skip if distance is too high
                        continue
                    results[r.distance] = (r.entity, c)
            if len(results) == 0:
                # No matching documents
                print("No matching documents")
                return -1, -1, -1
            # Sort by distance and return only k results
            distances = list(results.keys())
            distances.sort()
            distances = distances[:k]
            sorted_list = [results[i][0] for i in distances]
            # Return the collection name of the source document
            source = [
                {
                    "collection_name": results[i][1],
                    "url": results[i][0].get("url"),
                    "title": results[i][0].get("title"),
                }
                for i in distances
            ]
            return sorted_list, source, distances
        except Exception as e:
            raise Exception(f"MILVUS_HANDLER.SIMILARITY_SEARCH {str(e)}")

    def hybrid_search(
        self,
        collection,
        query_embeddings,
        limit_per_req=3,
        k=4,
        search_params=None,
        output_fields=["title", "article", "url"],
        filters: dict = None,
    ):
        """Perform hybrid search among the currently loaded collections. Using filter expressions to for metadata filtering"""
        try:
            results = {}
            source = []
            reranker = RRFRanker()
            reranker = WeightedRanker(1 - self.filter_bias, self.filter_bias)
            persistent_collection_bias = 0.9  # Reduce impact of persistent collections
            if search_params is None:
                search_params = {"metric_type": "L2", "params": {"nprobe": 5}}
            if filters is None:
                filters = {}

            for c in self.persistent_collections + [
                collection
            ]:  # Search from default collections + currently loaded collection
                reqs = []
                for q, filter in zip(query_embeddings, filters):
                    reqs.append(
                        AnnSearchRequest(
                            data=[q],
                            anns_field="embedding",
                            param=search_params,
                            limit=limit_per_req,
                            expr=filter.get(c, None),
                        )
                    )  # Search with filters
                    vanilla_expr = None
                    if "created_at_unix" in filter.get(
                        c, None
                    ):  # If the filter has a date, use it to filter the results
                        start_index = filter.get(c, None).find("created_at_unix")
                        if start_index != -1:
                            vanilla_expr = filter.get(c, None)[start_index:]
                    reqs.append(
                        AnnSearchRequest(
                            data=[q],
                            anns_field="embedding",
                            param=search_params,
                            limit=limit_per_req,
                            expr=vanilla_expr,
                        )
                    )  # Search without filters
                    try:
                        search_results = Collection(c).hybrid_search(
                            reqs,
                            rerank=reranker,
                            limit=k,
                            output_fields=(
                                output_fields
                                if type(output_fields) == list
                                else output_fields[c]
                            ),
                        )[0]
                    except MilvusException as e:
                        return -2, -2, -2  # Error in search
                    for r in search_results:
                        if c in self.persistent_collections:
                            results[r.distance * persistent_collection_bias] = (
                                r.entity,
                                c,
                            )
                        else:
                            results[r.distance] = (r.entity, c)
            if len(results) == 0:
                # No matching documents
                print("No matching documents")
                return -1, -1, -1
            # Sort by distance and return only k results
            distances = list(results.keys())
            distances.sort(reverse=True)
            distances = distances[:k]
            sorted_list = [results[i][0] for i in distances]
            for i in distances:
                print(i, results[i][1])
            # Return the collection name of the source document
            source = [
                {
                    "collection_name": results[i][1],
                    "url": results[i][0].get("url"),
                    "title": results[i][0].get("title"),
                }
                for i in distances
            ]
            return sorted_list, source

        except Exception as e:
            raise Exception(f"MILVUS_HANDLER.HYBRID_SEARCH {str(e)}")

    def create_collection(self, name, long_name, description, metadata):
        try:
            fields = []

            for key, value in metadata.items():
                if value["datatype"] == "int":
                    fields.append(
                        FieldSchema(
                            name=key,
                            description=value["description"],
                            dtype=DataType.INT64,
                            **value["params"],
                        )
                    )
                elif value["datatype"] == "float":
                    fields.append(
                        FieldSchema(
                            name=key,
                            description=value["description"],
                            dtype=DataType.FLOAT,
                            **value["params"],
                        )
                    )
                elif value["datatype"] == "string":
                    fields.append(
                        FieldSchema(
                            name=key,
                            description=value["description"],
                            dtype=DataType.VARCHAR,
                            **value["params"],
                        )
                    )
                elif value["datatype"] == "list":
                    fields.append(
                        FieldSchema(
                            name=key,
                            description=value["description"],
                            dtype=DataType.ARRAY,
                            **value["params"],
                        )
                    )  # Broken, need to expand params
                elif value["datatype"] == "bool":
                    fields.append(
                        FieldSchema(
                            name=key,
                            description=value["description"],
                            dtype=DataType.BOOL,
                            **value["params"],
                        )
                    )
                elif value["datatype"] == "vector":
                    fields.append(
                        FieldSchema(
                            name=key,
                            description=value["description"],
                            dtype=DataType.FLOAT_VECTOR,
                            **value["params"],
                        )
                    )

            try:
                schema = CollectionSchema(fields=fields, description=description)
                collection = Collection(name, schema)
                index_params = {
                    "metric_type": "L2",
                    "index_type": "IVF_FLAT",
                    "params": {"nlist": 2048},
                }

                collection.create_index(
                    field_name="embedding", index_params=index_params
                )
                # Replace spaces with _ in long_name, and remove accents
                import unicodedata

                nfkd_form = unicodedata.normalize("NFKD", long_name)
                long_name = "".join(
                    [c for c in nfkd_form if not unicodedata.combining(c)]
                )
                long_name = long_name.replace(" ", "_")
                long_name = long_name.replace("đ", "d").replace("Đ", "D")

                utility.create_alias(collection_name=name, alias=long_name)

            except MilvusException as e:
                print(f"MilvusException while creating collection: {e}")
                raise Exception(f"Error while creating collection: {e}")
            except BaseException as e:
                print(f"BaseException while creating collection: {e}")
                raise Exception(f"Error while creating collection: {e}")
            except Exception as e:
                print(f"Exception while creating collection: {e}")
                raise Exception(f"Error while creating collection: {e}")

            # Update theme descriptions
            self.update_collection_descriptions()

            self.update_pydantic_schema(name)

            return True
        except MilvusException as e:
            raise Exception(f"MILVUS_HANDLER.CREATE_COLLECTION {str(e)}")
        except Exception as e:
            raise Exception(f"MILVUS_HANDLER.CREATE_COLLECTION {str(e)}")

    def drop_collection(self, name):
        try:
            # Drop all aliases
            aliases = Collection(name).aliases
            for alias in aliases:
                utility.drop_alias(alias)
            Collection(name).drop()

            self.update_collection_descriptions()
            self.pydantic_collections.pop(name, None)
            return {"message": "drop collection success"}

        except MilvusException as e:
            raise Exception(f"MILVUS_HANDLER.DROP_COLLECTION {str(e)}")

        except Exception as e:
            raise Exception(f"MILVUS_HANDLER.DROP_COLLECTION {str(e)}")

    def delete_document(self, collection_name, document_id):
        try:
            Collection(collection_name).delete(expr=f"document_id == '{document_id}'")
            return True, "Success"

        except MilvusException as e:
            return False, e.message

        except Exception as e:
            raise e

    def list_collections(self):
        """Retrieve all collections in Milvus."""
        try:
            collections = self._handler.list_collections()
            return collections

        except MilvusException as e:
            print(f"Error listing collections: {e}")
            return []

        except Exception as e:
            raise e

    def get_collection(self, collection_name):
        try:
            if collection_name is None:
                raise Exception("GET_COLLECTION.NAME_INVALID")
            colection_object = Collection(collection_name)
            return {
                "collection_name": collection_name,
                "description": colection_object.description,
                "num_entities": colection_object.num_entities,
                "fields": [field.name for field in colection_object.schema.fields],
                "schema": self.get_collection_schema(collection_name),
            }
        except MilvusException as e:
            raise Exception(f"Error listing collections: {e}")

        except Exception as e:
            raise e

    def list_collections_with_details(self):
        """Retrieve all collections in Milvus."""
        try:
            list_collections = self._handler.list_collections()
            collection_detail = {}
            print(list_collections)
            for collection_name in list_collections:
                print(collection_name)
                colection_object = Collection(collection_name)
                fields = [field.name for field in colection_object.schema.fields]
                collection_detail[collection_name] = {
                    "name_id": collection_name,
                    "description": colection_object.description,
                    "num_entities": colection_object.num_entities,
                    "fields": fields,
                    "schema": self.get_collection_schema(collection_name),
                }

            return {"list_collections": list_collections, "details": collection_detail}

        except MilvusException as e:
            raise Exception(f"Error listing collections: {e}")

        except Exception as e:
            raise e

    def get_documents_in_collection(self, collection_name=None, batch_size=1000):
        try:
            collection = Collection(collection_name)
            collection.load()

            grouped = defaultdict(list)
            last_id = 0  # id cuối cùng đã lấy
            while True:
                results = collection.query(
                    expr=f"id > {last_id}",
                    output_fields=[
                        "document_id",
                        "title",
                        "article",
                        "created_at",
                        "updated_at",
                        "is_active",
                        "url",
                        "chunk_id",
                    ],
                    limit=batch_size,
                )

                if not results:
                    break  # hết dữ liệu

                for doc in results:
                    doc_name = doc.get("document_id")
                    grouped[doc_name].append(doc)

                # Cập nhật last_id
                last_id = max(doc["id"] for doc in results)

            return grouped

        except MilvusException as e:
            raise Exception(f"Error listing documents: {e}")

        except Exception as e:
            raise e
