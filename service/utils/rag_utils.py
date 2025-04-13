import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.utils import DistanceStrategy

# from ibm_watsonx_ai.metanames import EmbedTextParamsMetaNames as EmbedParams
# from ibm_watsonx_ai.foundation_models import Embeddings
# from pymilvus.model.dense import SentenceTransformerEmbeddingFunction
from sentence_transformers import SentenceTransformer

import pymongo
import json
import ast

from pymilvus import(
    IndexType,
    Status,
    connections,
    FieldSchema,
    DataType,
    Collection,
    CollectionSchema,
    AnnSearchRequest,
    RRFRanker,
    WeightedRanker,
    MilvusException,
    utility
)

CACHE_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
)

##ENCODER
class Encoder:
    def __init__(
        self, model_name: str = "intfloat/multilingual-e5-large", device="cpu", provider="vllm"
    ):
        if provider == "IBM":
            my_credentials = {
                "url": "https://us-south.ml.cloud.ibm.com",
                "apikey": os.environ['WATSONX_APIKEY'],
            }

            # model_id = 'sentence-transformers/all-minilm-l12-v2'
            model_id = 'intfloat/multilingual-e5-large'
            gen_parms = None
            project_id = os.environ['WATSONX_PROJECT_ID']
            space_id = None
            verify = False

            # Set the truncate_input_tokens to a value that is equal to or less than the maximum allowed tokens for the embedding model that you are using. If you don't specify this value and the input has more tokens than the model can process, an error is generated.

            embed_params = {
                EmbedParams.TRUNCATE_INPUT_TOKENS: 512,
            }

            model = Embeddings(
                model_id=model_id,
                credentials=my_credentials,
                params=embed_params,
                project_id=project_id,
                verify=verify
            )
            self.embedding_function = model.embed_query()
        elif provider == "local":
            model = SentenceTransformer(model_name)
            self.embedding_function = model.encode
        elif provider == "vllm":
            from openai import OpenAI
            def embed(text):
                client = OpenAI(api_key="EMPTY",base_url=os.environ['VLLM_URL'])
                return client.embeddings.create(
                    input=text,
                    model=model_name
                ).data[0].embedding
            self.embedding_function = embed
        elif provider == "HuggingFace":
            import requests

            API_URL = "https://api-inference.huggingface.co/models/intfloat/multilingual-e5-large"
            headers = {"Authorization": os.environ['HF_APIKEY']}

            def query(payload):
                payload = {"inputs": payload}
                response = requests.post(API_URL, headers=headers, json=payload)
                return response.json()
                
            self.embedding_function = query
        elif provider == "OpenAI":
            import openai
            openai.api_key = os.environ['OPENAI_APIKEY']
            def embed(text):
                response = openai.embeddings.create(
                    model="text-embedding-3-large",
                    input=text
                )
                return response.data[0].embedding
            self.embedding_function = embed
            

##DATABASES
class MongoDB:
    def __init__(self, db_name):
        # Connect to your Atlas cluster
        connection_string = os.getenv()
        mongo_client = pymongo.MongoClient(connection_string)
        self.client = mongo_client
        self.db = mongo_client[db_name]
    
    def similarity_search(self, question: str, k: int = 3):
        pass

class MilvusDB:
    def __init__(self, host,port,password,user,uri,token,server_pem_path=None,server_name='localhost', k=4, filter_bias=0.4) -> None:
        
        if host != "":
            connections.connect(alias = 'default',
                            host = host,
                            port = port)
        else: #Remote Zilliz cloud connection
            connections.connect(alias = 'default',
                                uri=uri,
                                token=token,
            )
        self.persistent_collections = []
        self._handler = connections._fetch_handler('default')
        self.search_threshold = os.getenv('SEARCH_THRESHOLD', 1.1)
        self.latest_timespan_months = os.getenv('LATEST_TIMESPAN_MONTHS', 5)
        self.k = k
        self.filter_bias = filter_bias
        # Create pydantic representation of collections schemas
        from pydantic import create_model
        self.pydantic_collections = {}
        collections = self._handler.list_collections()
        for col in collections:
            self.update_pydantic_schema(col) #Update pydantic schema for each collection
        # Create descriptions of themes (collections) in the database
        self.themes_descriptions = ""
        self.update_collection_descriptions()

    def update_collection_descriptions(self):
        descriptions = ""
        for col in self._handler.list_collections():
            result = self.describe_collection(col, alias=True)
            descriptions += f"{result[1]}: {result[0]['description']}\n"
            # descriptions += f"{name}: {Collection(col).describe()['description']}\n"
        self.themes_descriptions = descriptions
        return True
    
    def update_pydantic_schema(self, collection_name):
        # Update pydantic schema
        from pydantic import create_model
        schema = self.get_collection_schema(collection_name=collection_name, readable=True, exclude_metadata=['created_at', 'updated_at', 'document_id', 'title', 'updated_at', 'url', 'in_effect'])
        fields = {"article": (str, ...), "latest": (bool, ...)}
        for field, attrs in schema.items():
            if attrs['type'] == 'int':
                fields[field] = (int, ...)
            elif attrs['type'] == 'float':
                fields[field] = (float, ...)
            elif attrs['type'] == 'string':
                fields[field] = (str, ...)
            elif attrs['type'] == 'list':
                fields[field] = (list[str], ...)
            elif attrs['type'] == 'bool':
                fields[field] = (bool, ...)
        model = create_model(collection_name, **fields)
        self.pydantic_collections[collection_name] = model
        return True
    
    def update_json_schema(self, collection_name):
        schema = self.get_collection_schema(collection_name=collection_name, readable=True, exclude_metadata=['created_at', 'updated_at', 'document_id', 'title', 'updated_at', 'url', 'in_effect'])
        fields = {"article": {"type": "string", "description":"The content of the article"},
                              "latest": {"type": "boolean", "description":"Whether the user's question requires the latest articles"}}
        #TODO
        pass

    def describe_collection(self, collection_name, alias=False):
        if alias:
            collection = Collection(collection_name)
            collection_name = collection.aliases[0] if len(collection.aliases) > 0 else collection_name # Get alias if it exists
            return collection.describe(), collection_name
        else:
            return Collection(collection_name).describe()

    def get_collection_schema(self, collection_name, readable=False, exclude_metadata=[]):
        schema = Collection(collection_name).describe()['fields']
        if not readable:
            return schema
        
        schema_readable = {}
        def convert_type(type):
            if type == DataType.INT8 or type == DataType.INT16 or type == DataType.INT32 or type == DataType.INT64:
                return 'int'
            elif type == DataType.FLOAT or type == DataType.DOUBLE:
                return 'float'
            elif type == DataType.VARCHAR or type == DataType.STRING:
                return 'string'
            elif type == DataType.ARRAY:
                return 'list'
            else:
                return 'unknown'
        for meta in schema:
            if meta['name'] in ['id', 'embedding', 'chunk_id', 'article', 'is_active', 'page_number', 'file_links',] + exclude_metadata: #Skip these fields
                continue #TODO: Fix this to achieve better flexibility in the system
            schema_readable[meta['name']] = {}

            schema_readable[meta['name']]['type'] = convert_type(meta['type'])
            if schema_readable[meta['name']]['type'] == 'list':
                schema_readable[meta['name']]['element_type'] = convert_type(meta['element_type'])
                schema_readable[meta['name']]['max_size'] = meta['params']['max_capacity']
            elif schema_readable[meta['name']]['type'] == 'string':
                schema_readable[meta['name']]['max_length'] = meta['params']['max_length']

            schema_readable[meta['name']]['description'] = meta['description']
            schema_readable[meta['name']]['required'] = False
        if 'title' in schema_readable:
            schema_readable['title']['required'] = True
        return schema_readable
    
    def load_collection(self, name, persist=False):
        if persist:
            self.persistent_collections.append(name)
            collection = Collection(name)
            collection.load()
        else:
            collection = Collection(name)
            collection.load()

        # for c in connections._fetch_handler('default').list_collections():
        #     if c not in self.persistent_collections and c != name:
        #         Collection(c).release()
        return Status()
    
    def similarity_search(self, collection:str, query_embeddings, k: int = 4, search_params=None, output_fields=['title','article', 'url'], filters: dict = None):
        results = {}
        source = []
        if search_params is None:
            search_params = {
                "metric_type": "L2",
                "params": {"nprobe": 5}
            }
        if filters is None:
            filters = {}
        for c in self.persistent_collections + [collection]: #Search from default collections + currently loaded collection
            search_results = Collection(c).search(
                data=[query_embeddings],
                anns_field="embedding",
                param=search_params,
                limit=k,
                expr=filters.get(c, None),
                output_fields=output_fields if type(output_fields) == list else output_fields[c] #If the user specified different output fields
                                                                                                    # for different collections
            )[0]
            for r in search_results:
                if r.distance > self.search_threshold: #Skip if distance is too high
                    continue
                results[r.distance] = (r.entity, c)
        if len(results) == 0:
             #No matching documents
            print("No matching documents")
            return -1, -1, -1
        #Sort by distance and return only k results
        distances = list(results.keys())
        distances.sort()
        distances = distances[:k]
        sorted_list = [results[i][0] for i in distances]
        #Return the collection name of the source document
        source = [{'collection_name': results[i][1], 'url': results[i][0].get('url'), 'title': results[i][0].get('title')} for i in distances]
        return sorted_list, source, distances
    
    def hybrid_search(self, collection, query_embeddings, limit_per_req=3, k=4, search_params=None, output_fields=['title','article', 'url'], filters: dict = None):
        '''Perform hybrid search among the currently loaded collections. Using filter expressions to for metadata filtering'''
        results = {}
        source = []
        reranker = RRFRanker()
        reranker = WeightedRanker(1 - self.filter_bias, self.filter_bias)
        persistent_collection_bias = 0.9 # Reduce impact of persistent collections
        if search_params is None:
            search_params = {
                "metric_type": "L2",
                "params": {"nprobe": 5}
            }
        if filters is None:
            filters = {}
        
        for c in self.persistent_collections + [collection]: #Search from default collections + currently loaded collection
            reqs = []
            for q, filter in zip(query_embeddings, filters):
                reqs.append(AnnSearchRequest(
                    data=[q],
                    anns_field="embedding",
                    param=search_params,
                    limit=limit_per_req,
                    expr=filter.get(c, None),
                )) #Search with filters
                vanilla_expr = None
                if "created_at_unix" in filter.get(c, None): #If the filter has a date, use it to filter the results
                    start_index = filter.get(c, None).find("created_at_unix")
                    if start_index != -1:
                        vanilla_expr = filter.get(c, None)[start_index:]
                reqs.append(AnnSearchRequest(
                    data=[q],
                    anns_field="embedding",
                    param=search_params,
                    limit=limit_per_req,
                    expr=vanilla_expr,
                )) #Search without filters
                try:
                    search_results = Collection(c).hybrid_search(reqs, rerank=reranker, limit=k, output_fields=output_fields if type(output_fields) == list else output_fields[c])[0]
                except MilvusException as e:
                    return -2, -2, -2 #Error in search
                for r in search_results:
                    if c in self.persistent_collections:
                        results[r.distance * persistent_collection_bias] = (r.entity, c)
                    else:
                        results[r.distance] = (r.entity, c)
        if len(results) == 0:
            #No matching documents
            print("No matching documents")
            return -1, -1, -1
        #Sort by distance and return only k results
        distances = list(results.keys())
        distances.sort(reverse=True)
        distances = distances[:k]
        sorted_list = [results[i][0] for i in distances]
        for i in distances:
            print(i, results[i][1])
        #Return the collection name of the source document
        source = [{'collection_name': results[i][1], 'url': results[i][0].get('url'), 'title': results[i][0].get('title')} for i in distances]
        return sorted_list, source
    
    def create_collection(self, name, long_name, description, metadata):
        name = "_" + name #Add underscore to the name
        fields = []
        for key, value in metadata.items():
            if value['datatype'] == 'int':
                fields.append(FieldSchema(name=key, description=value['description'], dtype=DataType.INT64, **value['params']))
            elif value['datatype'] == 'float':
                fields.append(FieldSchema(name=key, description=value['description'], dtype=DataType.FLOAT, **value['params']))
            elif value['datatype'] == 'string':
                fields.append(FieldSchema(name=key, description=value['description'], dtype=DataType.VARCHAR, **value['params']))
            elif value['datatype'] == 'list':
                fields.append(FieldSchema(name=key, description=value['description'], dtype=DataType.ARRAY, **value['params'])) #Broken, need to expand params
            elif value['datatype'] == 'bool':
                fields.append(FieldSchema(name=key, description=value['description'], dtype=DataType.BOOL, **value['params']))
            elif value['datatype'] == 'vector':
                fields.append(FieldSchema(name=key, description=value['description'], dtype=DataType.FLOAT_VECTOR, **value['params']))
        schema = CollectionSchema(fields=fields, description=description)
        collection = Collection(name, schema)
        index_params = {
        'metric_type':'L2',
        'index_type':"IVF_FLAT",
        'params':{"nlist":2048}
        }
        collection.create_index(field_name='embedding', index_params=index_params)
        #Replace spaces with _ in long_name, and remove accents
        import unicodedata
        nfkd_form = unicodedata.normalize('NFKD', long_name)
        long_name = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
        long_name = long_name.replace(' ', '_')
        long_name = long_name.replace("đ", "d").replace("Đ", "D")

        utility.create_alias(
            collection_name=name,
            alias=long_name
        )
        #Update theme descriptions
        self.update_collection_descriptions()
        self.update_pydantic_schema(name)
        return True

    def drop_collection(self, name):
        try:
            #Drop all aliases
            aliases = Collection(name).aliases
            for alias in aliases:
                utility.drop_alias(alias)
            Collection(name).drop()
        except MilvusException as e:
            return False, e.message
        self.update_collection_descriptions()
        self.pydantic_collections.pop(name, None)
        return True, "Success"
    
    def delete_document(self, collection_name, document_id):
        try:
            Collection(collection_name).delete(expr=f"document_id == '{document_id}'")
            return True, "Success"
        except MilvusException as e:
            return False, e.message
def create_prompt_milvus(question, context, output_fields=['title','article']):
#     full_context = """
# You always answer with markdown formatting using GitHub syntax. Do not use ordered or numbered lists.
# You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. 
# Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
# Respond in a brief and concise manner.

# Try to answer the user's question using the given context below. The context consists of groups of a question, its answer and the section it belongs to.
# Specify which questions and sections you derived your final answer from.

# Do not start with "based on" or "according to" in your response or anything similar, in your response. 
# Provide your answer only based on the provided information. If the answer is not in provided information, explain that you are only trained on the provided information.
# Always answer in Vietnamese.

# """
    full_context = ""
    for answer in context:
        context = ""
        if type(output_fields) is not list:
            context = output_fields + ":" + answer.get(output_fields)
        else:
            for field in output_fields:
                value = answer.get(field)
                context = context + field.title() + ": " + value + "\n" # 'question: How are you?'
        full_context = full_context + context + "\n"

    # complete_prompt = full_context + "\nUSER'S QUESTION: " + question
    complete_prompt = full_context
    return complete_prompt

def determine_collection(question, model, database_descriptions, collection_names):
    prompt = """Using the collections descriptions below and the user's question. 
    Determine which collections to search to find the documents most related to the question.
    Do not provide any explanations, only answer with the collection name.
    """
    full_prompt = prompt + '\n' + database_descriptions + '\n' + question + '\n'
    result = model.model.generate_text(full_prompt)
    result = result.strip()
    for collection in collection_names:
        idx = result.find(collection)
        if idx != -1:
            result = result[idx:idx + len(collection)]
    return result

def metadata_extraction(query, model, schema: list|dict):
    '''Extract metadata from user query given a schema using a LLM call
    schema: can be list (names of metadata attributes) or dict (name-description key-value pairs)'''

    prompt = prompt = """Extract metadata from the user's query using the provided schema.
Do not include the metadata if not found.
User's query: {query}
Schema:
{schema}
Always answer in JSON format.
Answer:
"""
    if type(schema) is list:
        schema = ",".join(schema)
    elif type(schema) is dict:
        schema = "\n".join(k + ": " + v for k,v in schema.items())
    else:
        raise TypeError("Schema should be list or dict, got " + str(type(schema)))
    
    full_prompt = prompt.format(query=query, schema=schema)
    result = model.model.generate_text(full_prompt)
    try:
        result = json.loads(result)
    except json.JSONDecodeError: #Wrong format
        print("Metadata Extraction: Couldn't decode JSON - " + result)
        result = -1
    return result

def compile_filter_expression(metadata, loaded_collections: list, persistent_collections: list = [], latest_timespan_months: int = 5):
    '''Read collections schemas to compile filtering expressions for Milvus'''
    expressions = {}
    for c in loaded_collections:
        expressions[c] = ""
        short_schema = {}
        schema = Collection(c).describe()['fields']
        for s in schema:
            short_schema[s['name']] = s['type']
        is_latest = False
        for attr, val in metadata.items():
            if val is None or val == "" or val == []: #Skip empty values
                continue
            if attr == 'article': #Skip article TODO: FIX THIS FOR BETTER FLEXIBILITY
                continue
            if attr == 'latest' and val == True and c not in persistent_collections: #If the user wants the latest articles
                is_latest = True
                print("SEARCH: Latest articles required")
                continue
            meta_type = short_schema.get(attr, -1)
            if meta_type == -1:
                continue

            if short_schema[attr] == DataType.INT8 or short_schema[attr] == DataType.INT16 or short_schema[attr] == DataType.INT32 or short_schema[attr] == DataType.INT64 or short_schema[attr] == DataType.FLOAT: #intege
                expressions[c] += attr + ' == ' + str(val) + " || "
            elif short_schema[attr] == DataType.VARCHAR:
                expressions[c] += attr + f' == "{val}"' + " || "
            elif short_schema[attr] == DataType.ARRAY:
                try:
                    if type(ast.literal_eval(val)) is list:
                        expressions[c] += f"array_contains_any({attr}, {ast.literal_eval(val)}) || "
                    else:
                        expressions[c] += f"array_contains_any({attr}, {val}) || "
                except ValueError:
                    expressions[c] += f"array_contains_any({attr}, {val}) || "
        if is_latest: #Filter expression requires latest articles
            expressions[c] = expressions[c].removesuffix(' || ')
            import datetime
            # Get the current date and time
            now = datetime.datetime.now()
            # Get the current timestamp in seconds since epoch minus 5 months
            current_timestamp = int(now.timestamp()) - latest_timespan_months * 30 * 24 * 60 * 60 #5 months in seconds
            # Add the timestamp to the filter expression
            if expressions[c] != "":
                expressions[c] = "(" + expressions[c] + ")" + " && " + "created_at_unix >= " + str(current_timestamp)
            else:
                expressions[c] = "created_at_unix >= " + str(current_timestamp)
        else:
            # Reformat
            expressions[c] = expressions[c].removesuffix(' || ')
    return expressions

#------------------------------------#
def metadata_extraction_v2(query, model, collection_name, database, pydantic_schema=None):
    '''Extract metadata from user query given a schema using a LLM call
    schema: can be list (names of metadata attributes) or dict (name-description key-value pairs)'''

    prompt = prompt = """Extract metadata from the user's query using the provided schema.
Do not include the metadata if not found.\
Always leave article attribute as empty.
User's query: {query}
Schema:
{schema}
Always answer as a JSON object.
Answer:
"""
    # fields = Collection(collection_name).describe()['fields']
    fields = database.get_collection_schema(collection_name, readable=False)
    # if type(schema) is list:
    #     schema = ",".join(schema)
    # elif type(schema) is dict:
    #     schema = "\n".join(k + ": " + v for k,v in schema.items())
    # else:
    #     raise TypeError("Schema should be list or dict, got " + str(type(schema)))
    schema = {}
    for field in fields:
        schema[field['name']] = field['description']
    schema = "\n".join(k + ": " + v for k,v in schema.items())
    schema += "latest: whether the user's question requires the latest articles.\n"

    full_prompt = prompt.format(query=query, schema=schema)
    if pydantic_schema is not None:
        result = model._generate(prompt=full_prompt, response_schema=pydantic_schema).model_dump_json()
    else:
        result = model._generate(full_prompt)
    result = result.replace('"', '\"') #Escape quotes
    try:
        result = json.loads(result)
        for k, v in result.items():
            if type(v) is str:
                result[k] = v.lower()
            elif type(v) is list:
                result[k] = [x.lower() for x in v]
    except json.JSONDecodeError: #Wrong format
        try:
            result = result.replace("`", '').replace("json", '')
            result = json.loads(result)
            for k, v in result.items():
                if type(v) is str:
                    result[k] = v.lower()
                elif type(v) is list:
                    result[k] = [x.lower() for x in v]
        except json.JSONDecodeError:
            print("Metadata Extraction: Couldn't decode JSON - " + result)
            result = -1
    return result

def rewrite_query(conversation, model, k=2):
    '''Rewrite the user's query using the context of the conversation'''
    prompt = """Summarize the user's conversation into a query to be used as a search query.
User's conversation:
\\
{conversation}
\\
Note that the user can change the topic in the middle of the conversation, only consider the newest topic.
Summarize in {k} different ways. Don't change the language of the query. (Mostly Vietnamese)
Use this JSON schema, answer with the JSON string representation ONLY:
Return: list[str]"""
    full_prompt = prompt.format(conversation=conversation, k=k)
    print("Rewriting Queries--------")
    print(full_prompt)
    print("-------END--------")
    try:
        response = model._generate(full_prompt)
        response = response.replace("`", '').replace("json", '')
        result = json.loads(response)
    except json.JSONDecodeError:
        print("Couldn't decode JSON - " + response)
        result = -1
    return result

def get_document(filename, collection_name):
    '''Get metadata from a file'''
    results = {}
    collection = Collection(collection_name)
    collection.load()
    chunk_id_name = 'chunk_id' if collection_name != 'student_handbook' else 'page_number'
    search_results = collection.query(
        expr=f"document_id == '{filename}'",
        output_fields=['article', chunk_id_name],
    )
    for r in search_results:
                results[r[chunk_id_name]] = r['article']
    if len(results) == 0: #No matching documents
        return -1
    #Sort by distance and return only k results
    myKeys = list(results.keys())
    myKeys.sort()
    sorted_list = [results[i] for i in myKeys]
    return sorted_list

def enhance_document(article, collection_name, pydantic_schema, model):
    '''Enhance the user's document by rewriting and extracting metadata'''
    prompt = """From the provided article, rewrite it to clean any spelling mistakes, grammatical errors, and missing spaces.\
Keep the original language of the article (Vietnamese).\
    Additionally, extract metadata from the article using the provided schema. Metadata fields that are lists can have a maximum of 5 elements.\
    If the metadata field does not exist in the article, do not include it in the response.
    Schema descriptions:
    {schema}
    Article (encased in backticks): 
    ```
    {article}
    ```"""
    fields = Collection(collection_name).describe()['fields']
    schema = {}
    for field in fields:
        schema[field['name']] = field['description']
    schema = "\n".join(k + ": " + v for k,v in schema.items())
    response = model._generate(prompt.format(article=article, schema=schema), response_schema=pydantic_schema)
    try:
        #print(obj)
        obj = json.loads(response.model_dump_json())
    except json.JSONDecodeError:
            print("Couldn't decode JSON - " + response.model_dump_json())
            obj = -1
    return obj
