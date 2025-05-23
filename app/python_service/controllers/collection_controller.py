import json

from flask import current_app  # type: ignore

from middlewares.buildErrorObject import buildErrorObject

from controllers.handler.milvus_handler import Milvus_Handler


class Collection_Controller:
    def __init__(self):
        self.metadata = {
            "title": {
                "description": "",
                "datatype": "string",
                "params": {"max_length": 700},
            },
            "article": {
                "description": "",
                "datatype": "string",
                "params": {"max_length": 5000},
            },
            "embedding": {
                "description": "",
                "datatype": "vector",
                "params": {"dim": 3072},
            },  # 1024
            "url": {
                "description": "",
                "datatype": "string",
                "params": {"max_length": 300},
            },
            "chunk_id": {"description": "", "datatype": "int", "params": {}},
            "created_at": {
                "description": "",
                "datatype": "string",
                "params": {"max_length": 50},
            },
            "updated_at": {
                "description": "",
                "datatype": "string",
                "params": {"max_length": 50},
            },
            "is_active": {
                "description": "",
                "datatype": "bool",
                "params": {},
            },  # Float,int,string,list,bool
            "document_id": {
                "description": "",
                "datatype": "string",
                "params": {"max_length": 50},
            },
            "id": {
                "description": "",
                "datatype": "int",
                "params": {"is_primary": True, "auto_id": True},
            },
        }

        self.__database = Milvus_Handler()

    def create_collection(self, name, long_name, description, custom_metas={}):
        try:
            default_metadata = {
                "title": {
                    "description": "",
                    "datatype": "string",
                    "params": {"max_length": 700},
                },
                "article": {
                    "description": "",
                    "datatype": "string",
                    "params": {"max_length": 5000},
                },
                "embedding": {
                    "description": "",
                    "datatype": "vector",
                    "params": {"dim": 3072},
                },  # 1024
                "url": {
                    "description": "",
                    "datatype": "string",
                    "params": {"max_length": 300},
                },
                "chunk_id": {"description": "", "datatype": "int", "params": {}},
                "created_at": {
                    "description": "",
                    "datatype": "string",
                    "params": {"max_length": 50},
                },
                "updated_at": {
                    "description": "",
                    "datatype": "string",
                    "params": {"max_length": 50},
                },
                "is_active": {
                    "description": "",
                    "datatype": "bool",
                    "params": {},
                },  # Float,int,string,list,bool
                "document_id": {
                    "description": "",
                    "datatype": "string",
                    "params": {"max_length": 50},
                },
                "id": {
                    "description": "",
                    "datatype": "int",
                    "params": {"is_primary": True, "auto_id": True},
                },
            }

            # default_metadata.update(custom_metas)
            new_metadata = default_metadata | custom_metas

            database = self.__database

            database.create_collection(name, long_name, description, new_metadata)

            return {"name": name, "long_name": long_name, "description": description}

        except Exception as e:
            raise Exception(
                buildErrorObject(
                    "Lỗi ở Collection_Controller/create_collection", str(e)
                )
            )

    def drop_collection(self, collection_name):
        try:
            database = self.__database
            database.drop_collection(collection_name)
            return {collection_name: collection_name}
        except Exception as e:
            raise Exception(
                buildErrorObject("Lỗi ở Collection_Controller/drop_collection", str(e))
            )

    def get_schema(self, collection_name, readable=True):
        try:
            database = self.__database
            return database.get_collection_schema(collection_name, readable)

        except Exception as e:
            raise Exception(
                buildErrorObject("Lỗi ở Collection_Controller/get_schema", str(e))
            )

    def get_collection(self, collection_name=None):
        try:
            database = self.__database
            if collection_name is None or collection_name == "null":
                return database.list_collections_with_details()
            return database.get_collection(collection_name)

        except Exception as e:
            raise Exception(
                buildErrorObject("Lỗi ở Collection_Controller/get_collection", str(e))
            )
