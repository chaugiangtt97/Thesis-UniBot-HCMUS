# type: ignore
from controllers.generate_controller import Generate_Controller as Generate
from controllers.helper.getLLMConfigs import get_llm_configs
from middlewares.handleError import handleError

from flask import Blueprint, request, jsonify, Response, stream_with_context, current_app
from flask_cors import cross_origin
from controllers.exampleController import authController
from werkzeug.utils import secure_filename
from langchain_text_splitters import RecursiveCharacterTextSplitter

from dotenv import load_dotenv
import os
import json
import requests
from requests.auth import HTTPBasicAuth

from models.model import ChatModel, QueryRouter
from utils import rag_utils

main = Blueprint("main", __name__)
os.chdir('../..')

load_dotenv('../.env')

@main.route("/", methods=["GET"])
@cross_origin()
def init():
    return jsonify({"text": "Server is running"})


@main.route("/auth", methods=["GET"])
@cross_origin()
def auth():
    auth = authController()
    return jsonify(auth)

# @main.route("/load", methods=["GET"])
# @cross_origin()
# def preload():
#     # chat_model_id = request.args.get('model_id', default="meta-llama/llama-3-1-70b-instruct")
#     print("---LOADING ASSETS---")
#     chat_model_id = "meta-llama/llama-3-1-70b-instruct"
#     global model
#     #model = ChatModel(model_id=chat_model_id)
#     model = ChatModel(provider=os.getenv("PROVIDER"), model_id=os.getenv("CHAT_MODEL_ID"))
#     print("Chat model loaded.")
#     # global encoder
#     # encoder = rag_utils.Encoder(provider=os.getenv("EMBED_PROVIDER", "local"))
#     # print("Encoder loaded.")
#     # global pho_queryrouter
#     # pho_queryrouter = PhoQueryRouter()
#     # print("Query Router loaded.")
#     global database
#     database = rag_utils.MilvusDB(
#         host=os.getenv('MILVUS_HOST', ""), port=os.getenv('MILVUS_PORT', ""),
#         user=os.getenv('MILVUS_USERNAME', ""), password=os.getenv('MILVUS_PASSWORD', ""),
#         uri=os.getenv('MILVUS_URI', ""), token=os.getenv('MILVUS_TOKEN', "")
#     )
#     database.load_collection('student_handbook', persist=True)
#     print("Database loaded.")
#     # return jsonify({})
#     print("All assets loaded.")
#     return

# """ Handles the determine collection route """
# @main.route("/generate/determine_collection", methods=["POST"])
# @cross_origin()
# def determine_collection():
#     try:        
#         query = request.form.get('query')
#         if not query:
#             return handleError(400, "Missing required parameter 'query'")
#         history_raw = request.form.get('history', '[]')
        
#         try:
#             history = json.loads(history_raw)
#             if not isinstance(history, list):
#                 raise ValueError("History must be a JSON array")
#         except json.JSONDecodeError:
#             return handleError(400, "Invalid JSON format for 'history'")
#         except ValueError as ve:
#             return handleError(400, str(ve))
            
#         generateObject = Generate() 
#         collection = generateObject.determine_collection(query, history)
        
#         return collection, 200
    
#     except Exception as e: 
#         return handleError(500, str(e))
    
#     # # threshold = 0.5
#     # #----------------------------------
#     # queryrouter = current_app.config['QUERYROUTER']
#     # conversation = ""
#     # for h in history:
#     #     conversation += h['question'] + ". "
#     # conversation += query
#     # if queryrouter.use_history: #Determine using conversation history
#     #     # segmented_query = query_routing.segment_vietnamese(conversation + query)
#     #     # if type(segmented_query) is list:
#     #     #     segmented_conversation = " ".join(segmented_query)
#     #     # else:
#     #     #     segmented_conversation = segmented_query
#     #     # prediction = pho_queryrouter.classify(segmented_conversation)[0]
#     #     # chosen_collection = prediction['label']
#     #     # print("Query Routing: " + chosen_collection + " ----- Score: " + str(prediction['score']) + "\n")

#     #     # if prediction['score'] >= pho_queryrouter.threshold: 
#     #     #     return jsonify({'collection': chosen_collection})
#     #     prediction = queryrouter.classify(conversation)
#     # else:
#     #     prediction = queryrouter.classify(query)
#     # if prediction != -1:
#     #     return jsonify({'collection': prediction.removeprefix('_')})
#     # else:
#     #     return jsonify({'collection': ""})


# """ Handles the metadata extraction route """
# @main.route("/generate/extract_meta", methods=['POST'])
# @cross_origin()
# def extract_metadata_route():
#     try:
#         query = request.form.get('query')
#         if not query:
#             return handleError(400, "Missing required parameter 'query'")

#         chosen_collection = request.form.get('chosen_collection', '')
#         if chosen_collection not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#             chosen_collection = f"_{chosen_collection}"

#         history_raw = request.form.get('history', '[]')
#         try:
#             history = json.loads(history_raw)
#             if not isinstance(history, list):
#                 raise ValueError("History must be a JSON array")
#         except (json.JSONDecodeError, ValueError) as e:
#             return handleError(400, str(e))

#         generate_object = Generate()
#         filter_expressions = generate_object.extract_metadata(query, chosen_collection, history)

#         return jsonify({ filter_expressions }), 200
#     except Exception as e:
#         return handleError(500, str(e))
        
        
        
#         # schema = ['school_year', 'in_effect', 'created_at', 'updated_at']
#         # n_new_queries = 2
#         # database = current_app.config['DATABASE']

        
#         # model_configs = get_llm_configs('ACTIVE')
    
#         # model = ChatModel(provider= model_configs.provider, model_id=model_configs.chat_model_id)  
#         # # model = current_app.config['CHAT_MODEL']
#         # #----------------------------------
#         # conversation = ""
#         # for h in history:
#         #     conversation += h['question'] + ".\n"
#         # conversation += query
#         # #extracted_metadata = rag_utils.metadata_extraction(query, model, schema)
#         # is_old_extract = True
#         # if is_old_extract: #OLD METADATA EXTRACTION
#         #     extracted_metadata = rag_utils.metadata_extraction_v2(query, model, chosen_collection, database=database)
#         #     print(extracted_metadata)
#         #     if extracted_metadata != -1: #No metadata found
#         #         filter_expressions = rag_utils.compile_filter_expression(extracted_metadata, database.persistent_collections + [chosen_collection], database.persistent_collections, latest_timespan_months=database.latest_timespan_months)
#         #     else:
#         #         filter_expressions = {}
#         #     return jsonify(filter_expressions)
        
#         # rewritten_queries = rag_utils.rewrite_query(conversation=conversation, model=model, k=n_new_queries)
#         # if rewritten_queries == -1:
#         #     extracted_metadata = rag_utils.metadata_extraction_v2(query, model, chosen_collection)
#         #     if extracted_metadata != -1: #No metadata found
#         #         filter_expressions = rag_utils.compile_filter_expression(extracted_metadata, database.persistent_collections + [chosen_collection], database.persistent_collections, latest_timespan_months=database.latest_timespan_months)
#         #     else:
#         #         filter_expressions = {}
#         #     return jsonify(filter_expressions)
#         # else:
#         #     filter_expressions = []
#         #     for q in rewritten_queries:
#         #         extracted_metadata = rag_utils.metadata_extraction_v2(q, model, chosen_collection)
#         #         if extracted_metadata != -1: #No metadata found
#         #             expr = rag_utils.compile_filter_expression(extracted_metadata, database.persistent_collections + [chosen_collection], database.persistent_collections, latest_timespan_months=database.latest_timespan_months)
#         #         else:
#         #             expr = {}
#         #         filter_expressions.append({q: expr})
#         #     return jsonify(filter_expressions)    

# @main.route("/generate/search", methods=["GET"])
# @cross_origin()
# def search():
#     try:
#         query = request.args.get('query')
#         if not query:
#             return handleError(400, "Missing required parameter 'query'")

#         chosen_collection = request.args.get('chosen_collection', '')
#         if chosen_collection not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#             chosen_collection = f"_{chosen_collection}"

#         filter_expressions_raw = request.args.get('filter_expressions', None)
#         filter_expressions = None
#         if filter_expressions_raw:
#             try:
#                 filter_expressions = json.loads(filter_expressions_raw)
#             except json.JSONDecodeError:
#                 return handleError(400, "Invalid JSON format for 'filter_expressions'")

#         generate_object = Generate()
#         context, source = generate_object.search(query, chosen_collection, filter_expressions)

#         return jsonify({context, source}), 200

#     except Exception as e:
#         return handleError(500, str(e))
    
        
    
#     # # k = 4
#     # #encoder = rag_utils.Encoder(provider=os.getenv("EMBED_PROVIDER", "local"))
#     # encoder = current_app.config['ENCODER']
#     # database = current_app.config['DATABASE']
#     # k = database.k
#     # #----------------------------------
#     # database.load_collection(chosen_collection)
#     # # output_fields = {
#     # #     'student_handbook': ['title', 'article'],
#     # #     chosen_collection: ['title', 'article']
#     # # }
#     # if type(filter_expressions) == dict:
#     #     query_embeddings = encoder.embedding_function(query)
#     #     try:
#     #         # search_results, source, distances = database.similarity_search(chosen_collection, query_embeddings, filters=filter_expressions, k=k)
#     #         # search_results_vanilla, source_vanilla, distances_vanilla = database.similarity_search(chosen_collection, query_embeddings, k=k)

#     #         # if search_results == -1:
#     #         #     search_results = search_results_vanilla
#     #         #     source = source_vanilla
#     #         #     distances = distances_vanilla
#     #         # else:
#     #         #     filter_bias = database.filter_bias
#     #         #     distances = [d * filter_bias for d in distances] #Apply bias for filtered search by lowering the distance

#     #         #     search_results = search_results + search_results_vanilla
#     #         #     source = source + source_vanilla
#     #         #     distances = distances + distances_vanilla
#     #         # results = {k: (article, s) for k, article, s in zip(distances, search_results, source)}

#     #         # distances.sort()
#     #         # distances = distances[:k]
#     #         # search_results_final = [results[k][0] for k in distances]
#     #         # source_final = [results[k][1] for k in distances]

#     #         search_results_final, source_final = database.hybrid_search(
#     #             collection=chosen_collection, 
#     #             query_embeddings=[query_embeddings], 
#     #             k=k,
#     #             limit_per_req=4,
#     #             filters=[filter_expressions],
#     #         )
#     #     except Exception as e:
#     #         print("Error with filter search")
#     #         print(e)
#     #         search_results_final, source_final, _ = database.similarity_search(chosen_collection, query_embeddings, k=k)
#     #     if search_results_final != -1:
#     #         context = rag_utils.create_prompt_milvus(query, search_results_final)
#     #     else:
#     #         context = ""
#     #         source_final = []
#     # elif type(filter_expressions) == list: #Filter expressions contain rewritten queries - perform hybrid search
#     #     search_results_final, source_final, _ = database.hybrid_search(
#     #         collection=chosen_collection, 
#     #         query_embeddings=[encoder.embedding_function(list(q.keys())[0]) for q in filter_expressions], 
#     #         k=k,
#     #         limit_per_req=4,
#     #         filters=[list(q.values())[0] for q in filter_expressions]
#     #         )
#     #     if search_results_final != -1:
#     #         context = rag_utils.create_prompt_milvus(query, search_results_final)
#     #     elif search_results_final == -2: #Error in hybrid search, revert to vanilla search
#     #         search_results_vanilla, source_vanilla, distances_vanilla = database.similarity_search(chosen_collection, query_embeddings, k=k)
#     #         context = rag_utils.create_prompt_milvus(query, search_results_vanilla)
#     #     else:
#     #         context = "No related documents found"
#     #         source_final = []
#     # del encoder
#     # return jsonify({
#     #     'context': context,
#     #     'source': source_final
#     #     })

# @main.route("/generate", methods=["POST"])
# @cross_origin()
# def generate():
#     try:
#         query = request.form['query'] # Tin nhắn người dùng
#         context = request.form['context'] # Context từ api search
#         streaming = request.form['streaming'].lower() == "true"  #True or False 
#         history = json.loads(request.form['history']) # Conversation history
#         theme = request.form['collection_name'] # Collection name
#         user_profile = request.form['user_profile'] # User profile
        
#         answer = Generate().generate(query, context, streaming, theme, user_profile, history)
        
#         if answer and streaming:
#           def generate_stream():
#             for part in answer:
#               yield part  # Yield từng phần của câu trả lời
#           return Response(generate_stream(), content_type='text/plain;charset=utf-8')
          
#         return jsonify({ answer }), 200
    
#     except Exception as e: 
#         return handleError(500, e)
    
#     # if theme not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#     #     theme = "_" + theme
#     # # max_tokens = 1500 
#     # model_configs = get_llm_configs('ACTIVE')
    
#     # model = ChatModel(provider= model_configs.provider, model_id=model_configs.chat_model_id)
#     # # model = current_app.config['CHAT_MODEL']
#     # database = current_app.config['DATABASE']
#     # max_tokens = model.max_new_tokens
#     # #-------------------------------------------
#     # aliases = database.describe_collection(theme)['aliases']
#     # if len(aliases) > 0:
#     #     theme = aliases[0]
#     # answer = model.generate(query, context, streaming, max_tokens, history=history, user_profile=user_profile, theme=theme, themes_descriptions=database.themes_descriptions)
    
#     # # if streaming:
#     #     # return answer #Generator object, nếu không được thì thử thêm yield trước biến answer thử
        
#     # if streaming:
#     #     def generate_stream():
#     #         for part in answer:
#     #             yield part  # Yield từng phần của câu trả lời
#     #     return Response(generate_stream(), content_type='text/plain;charset=utf-8')
#     # else:
#     #     return jsonify({'answer': answer})

# @main.route("/get_file", methods=["GET","POST"])
# @cross_origin()
# def get_file():
#     ##PARAMS
#     if request.method == 'POST':
#         filename = request.form['document_id']
#         collection_name = request.form['collection_name']
#     elif request.method == 'GET':
#         filename = request.args.get['document_id'] 
#         collection_name = request.args.get['collection_name']
#     #-------------------------------------------
#     chunks = rag_utils.get_document(filename, collection_name)
#     return jsonify(chunks)

@main.route("/get_collection_schema", methods=["GET"])
@cross_origin()
def get_collection_schema():
    ##PARAMS
    collection_name = request.args.get('collection_name')
    if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
        collection_name = "_" + collection_name
    database = current_app.config['DATABASE']
    #-------------------------------------------
    schema = database.get_collection_schema(collection_name, readable=True)
    return jsonify(schema)

# @main.route("/insert_file", methods=["POST"])
# @cross_origin()
# def insert_file():
#     ##PARAMS
#     chunks = json.loads(request.form['chunks'])
#     collection_name = request.form['collection_name']
#     if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#         collection_name = "_" + collection_name
#     filename = request.form['filename']    
#     metadata = json.loads(request.form['metadata'])
    
#     print('Du lieu: ',collection_name, filename, metadata)
#     #-------------------------------------------
#     #Save chunks to local storage
#     if secure_filename(filename):
#         title = metadata['title']
#         chunks = ["Title: " + title + "\nArticle: " + c for c in chunks]
#         with open(os.getenv('AIRFLOW_TEMP_FOLDER') + '/' + filename, 'w+', encoding='utf-8') as f:
#             json.dump(chunks, f)
#             r = requests.post(f"http://{os.getenv('AIRFLOW_HOST')}:{os.getenv('AIRFLOW_PORT')}/api/v1/dags/{os.getenv('AIRFLOW_DAGID_INSERT')}/dagRuns", json={
#                 "conf": {
#                     "filename": filename,
#                     "collection_name": collection_name,
#                     "metadata": metadata
#                 }},
#                 auth=HTTPBasicAuth(os.getenv('AIRFLOW_USERNAME'), os.getenv('AIRFLOW_PASSWORD')))
#             response = r.json()
#             print(r.status_code,r.json())
#             return jsonify({
#                 'dag_run_id': response['dag_run_id'],
#                 'dag_id': response['dag_id'],
#                 'state': response['state']
#             })
#     else:
#         return jsonify({'status': 'failed'})
    
#     return jsonify({'status': 'success'})

# @main.route("/delete_file", methods=["POST"])
# @cross_origin()
# def delete_file():
#     ##PARAMS
#     document_id = request.form['document_id']
#     collection_name = request.form['collection_name']
#     if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#         collection_name = "_" + collection_name
#     database = current_app.config['DATABASE']
#     #-------------------------------------------
#     status, msg = database.delete_document(document_id=document_id, collection_name=collection_name)
#     if status:
#         return jsonify({'status': 'success'})
#     else:
#         return jsonify({'status': 'failed', 'message': msg}), 500

# @main.route("/chunk_file", methods=["POST"])
# @cross_origin()
# def chunk_file():
#     ##PARAMS
#     data = request.form['text']
#     #-------------------------------------------
#     splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=75)
#     chunks = splitter.split_text(data)
#     return jsonify(chunks)

# @main.route("/insert_file/enhance", methods=["POST"])
# @cross_origin()
# def enhance_document():
#     ##PARAMS
#     article = request.form['article']
#     collection_name = request.form['collection_name']
#     if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#         collection_name = "_" + collection_name

#     #-------------------------------------------
#     model_configs = get_llm_configs('ACTIVE')
    
#     model = ChatModel(provider= model_configs.provider, model_id=model_configs.chat_model_id)
#     database = current_app.config['DATABASE']
    
#     #TODO: Enhance document
#     pydantic_schema = database.pydantic_collections[collection_name]
#     result = rag_utils.enhance_document(article=article, model=model, collection_name=collection_name, pydantic_schema=pydantic_schema)
#     if result != -1:
#         splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=75)
#         chunks = splitter.split_text(result['article'])
#         result['chunks'] = chunks
#         metadata = {}
#         for k,v in result.items():
#             if k == 'article' or k == 'chunks':
#                 continue
#             metadata[k] = v
#             #result.pop(k)
#         result['metadata'] = metadata
#         return jsonify(result)

# @main.route("/collection", methods=["POST"])
# @cross_origin()
# def create_collection():
#     ##PARAMS
#     name = request.form['name']
#     long_name = request.form['long_name']
#     description = request.form['description']
#     metadata = {
#         "title": {"description": "", "datatype": "string", "params": {"max_length": 700}},
#         "article": {"description": "", "datatype": "string", "params": {"max_length": 5000}},
#         "embedding": {"description": "", "datatype": "vector", "params": {"dim": 3072}}, #1024
#         "url": {"description": "", "datatype": "string", "params": {"max_length": 300}},
#         "chunk_id": {"description": "", "datatype": "int", "params": {}},
#         "created_at": {"description": "", "datatype": "string", "params": {"max_length": 50}},
#         "updated_at": {"description": "", "datatype": "string", "params": {"max_length": 50}},
#         "is_active": {"description": "", "datatype": "bool", "params": {}}, #Float,int,string,list,bool
#         "document_id": {"description": "", "datatype": "string", "params": {"max_length": 50}},
#         "id": {"description": "", "datatype": "int", "params": {"is_primary": True, "auto_id": True}},
#     }

#     #print(request.form['metadata'][0])
#     # custom_meta = json.loads(request.form['metadata'])
#     # metadata.update(custom_meta)
    
#     # custom_metas = request.form['metadata']
    
#     # print(type(custom_metas))
#     # for custom_meta in custom_metas:
#     #     metadata.update(custom_meta)
    
#     print('custom_metas (string): ', request.form['metadata'])
#     print('name (string): ', request.form['name'])
#     print('long_name (string): ', request.form['long_name'])
#     print('description (string): ', request.form['description'])
    
#     custom_meta_array = json.loads(request.form['metadata'])
#     custom_metas = [json.loads(item) for item in custom_meta_array]

#     for custom_meta in custom_metas:
#         metadata.update(custom_meta)
    
#     print('metadata (all): ', metadata)
        
#     database = current_app.config['DATABASE']
#     #-------------------------------------------
#     database.create_collection(name, long_name, description, metadata)
#     return jsonify({'collection_name': name})

# @main.route("/collection", methods=["PATCH"])
# def drop_collection():
#     collection_name = request.form['collection_name']
#     if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
#         collection_name = "_" + collection_name
#     database = current_app.config['DATABASE']
#     status, msg = database.drop_collection(collection_name)
#     if status:
#         return jsonify({'status': 'success'})
#     else:
#         return jsonify({'status': 'failed', 'message': msg}), 500

@main.route("/params", methods=["POST"])
@cross_origin()
def update_params():
    ##PARAMS
    # Search params
    k = request.form['k']
    filter_bias = request.form['filter_bias']
    # Phobert params
    threshold = request.form['threshold']
    use_history = request.form['use_history'].lower() == 'true'
    # Chat model params
    max_tokens = request.form['max_tokens']
    #-------------------------------------------
    phobert = current_app.config['QUERYROUTER']
    phobert.threshold = float(threshold)
    phobert.use_history = use_history

    # model = current_app.config['CHAT_MODEL']
    model_configs = get_llm_configs('ACTIVE')
    
    model = ChatModel(provider= model_configs.provider, model_id=model_configs.chat_model_id)
    model.max_new_tokens = int(max_tokens)
    
    database = current_app.config['DATABASE']
    database.k = int(k)
    database.filter_bias = float(filter_bias)
    return jsonify({'status': 'success'})

@main.route("/params", methods=["GET"])
@cross_origin()
def list_params():
    ##PARAMS
    phobert = current_app.config['QUERYROUTER']
    # model = current_app.config['CHAT_MODEL']
    model_configs = get_llm_configs('ACTIVE')
    model = ChatModel(provider= model_configs.provider, model_id=model_configs.chat_model_id)
    
    database = current_app.config['DATABASE']
    #-------------------------------------------
    return jsonify({
        'threshold': phobert.threshold,
        'use_history': phobert.use_history,
        'max_tokens': model.max_new_tokens,
        'k': database.k,
        'filter_bias': database.filter_bias
    })
