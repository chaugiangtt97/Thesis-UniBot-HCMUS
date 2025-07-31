from flask import current_app # type: ignore

from controllers.helper.getLLMConfigs import get_llm_configs
from controllers.helper.getQueryRouterConfigs import get_queryRouter_configs
from controllers.helper.getEncoderConfigs import get_encoder_configs

from controllers.handler.milvus_handler import Milvus_Handler

from models.v2.ChatModel import ChatModel_v2 as ChatModel
from models.v2.QueryRouter import QueryRouter_v2 as QueryRouter
from models.v2.Encoder import Encoder_v2 as Encoder

from utils.v2 import rag as rag_utils

from middlewares.buildErrorObject import buildErrorObject
from middlewares.buildSuccessObject import buildSuccessObject

class Generate_Controller:
  def __init__(self):
    try:
      self.AIRFLOW_HOST = current_app.config.get('AIRFLOW_HOST')
      self.AIRFLOW_PORT = current_app.config.get('AIRFLOW_PORT')
      self.AIRFLOW_USERNAME = current_app.config.get('AIRFLOW_USERNAME', ' ')
      self.AIRFLOW_PASSWORD = current_app.config.get('AIRFLOW_PASSWORD', ' ')
      self.AIRFLOW_TEMP_FOLDER = current_app.config.get('AIRFLOW_TEMP_FOLDER', ' ')
      self.AIRFLOW_DAGID_INSERT = current_app.config.get('AIRFLOW_DAGID_INSERT', ' ')
      
      self.__database = Milvus_Handler()
    
    except Exception as e: 
      raise Exception("Không thể khởi tạo Generate_Controller ", str(e)) 
  
  def extract_metadata(self, query = None, chosen_collection = None, history = []):
    try:
      n_new_queries = 2
      
      model_configs = get_llm_configs('ACTIVE')
      model = ChatModel(model_configs) 
      
      database = self.__database
      
      conversation = ""
      for h in history:
          conversation += h['question'] + ".\n"
      conversation += query
      
      is_old_extract = True
      if is_old_extract: #OLD METADATA EXTRACTION
          extracted_metadata = rag_utils.metadata_extraction_v2(query, model, chosen_collection, database = database)

          if extracted_metadata != -1: #No metadata found
              filter_expressions = rag_utils.compile_filter_expression(
                extracted_metadata, database.persistent_collections + [chosen_collection], 
                database.persistent_collections, 
                latest_timespan_months = database.latest_timespan_months )
          else:
              filter_expressions = {}
              
          return buildSuccessObject( filter_expressions,
          "Filter expressions đã được xác định bởi câu hỏi và chủ đề đã thiết lập.")
      
      rewritten_queries = rag_utils.rewrite_query(conversation=conversation, model=model, k=n_new_queries)
      
      if rewritten_queries == -1:
          extracted_metadata = rag_utils.metadata_extraction_v2(query, model, chosen_collection)
          
          if extracted_metadata != -1: #No metadata found
              filter_expressions = rag_utils.compile_filter_expression(
                extracted_metadata, 
                database.persistent_collections + [chosen_collection], 
                database.persistent_collections, 
                latest_timespan_months = database.latest_timespan_months )
          else:
              filter_expressions = {}
              
          return buildSuccessObject( filter_expressions,
          "Filter expressions đã được xác định bởi câu hỏi và chủ đề đã thiết lập.")
      else:
          filter_expressions = []
          for q in rewritten_queries:
              extracted_metadata = rag_utils.metadata_extraction_v2(q, model, chosen_collection)
              if extracted_metadata != -1: #No metadata found
                  expr = rag_utils.compile_filter_expression(
                    extracted_metadata, 
                    database.persistent_collections + [chosen_collection], 
                    database.persistent_collections, 
                    latest_timespan_months = database.latest_timespan_months )
              else:
                  expr = {}
              filter_expressions.append({q: expr})
              
          return buildSuccessObject( filter_expressions,
          "Filter expressions đã được xác định bởi câu hỏi và chủ đề đã thiết lập.")
        
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/extract_metadata', e))
        
  
  def determine_collection(self, query, history, threshold = 0.5): 
    try:      
      database = self.__database
      
      model_configs = get_queryRouter_configs('ACTIVE')
      queryrouter = QueryRouter ( configs = model_configs, database = database )  
      
      conversation = ""
      for h in history:
          conversation += h['question'] + ". "
      conversation += query
        
      if queryrouter.use_history: # Determine using conversation history
        prediction = queryrouter.classify(conversation)  
      else:
          prediction = queryrouter.classify(query)
          
      if prediction == -1:
        return buildSuccessObject({'collection': ""}, "Query không khớp với bất kỳ chủ đề (collection) nào đã được thiết lập.")
      
      # Remove any leading underscore from the predicted collection name for clarity
      collection_name = prediction.removeprefix('_')
      return buildSuccessObject(
          {'collection': collection_name},
          "Query đã được xác định thuộc một chủ đề (collection) đã thiết lập."
      )
        
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/determine_collection', e))
  
  def search(self, query, chosen_collection, filter_expressions, context = "", source_final = []): 
    try:
      database = self.__database
      database.load_collection(chosen_collection)
      k = database.k
      
      encoder_configs = get_encoder_configs('ACTIVE')
      encoder = Encoder( configs = encoder_configs ) 
      
      context, source_final = "No related documents found", []

      if type(filter_expressions) == dict:
          query_embeddings = encoder.embedding_function(query)
          search_results_final = None
          try:
            search_results_final, source_final = database.hybrid_search(
                collection = chosen_collection, 
                query_embeddings = [query_embeddings], 
                k = k, limit_per_req = 4,
                filters = [filter_expressions] )
            
          except Exception as e:
              print("Error with hybrid_search search", str(e))
              try:
                search_results_final, source_final, _ = database.similarity_search(
                  collection = chosen_collection, k = k,
                  query_embeddings = query_embeddings )
                
              except Exception as es:
                print("Error with similarity_search search", str(es))
                raise
              
          if search_results_final != -1:
              context = rag_utils.create_prompt_milvus(query, search_results_final)
              
      elif type(filter_expressions) == list: #Filter expressions contain rewritten queries - perform hybrid search
        try:
          search_results_final, source_final, _ = database.hybrid_search(
              collection = chosen_collection, k = k,
              query_embeddings = [encoder.embedding_function(list(q.keys())[0]) for q in filter_expressions], 
              limit_per_req = 4,
              filters = [list(q.values())[0] for q in filter_expressions] )
          
          if search_results_final != -1:
              context = rag_utils.create_prompt_milvus(query, search_results_final)
              
          elif search_results_final == -2: #Error in hybrid search, revert to vanilla search
              search_results_vanilla, source_vanilla, distances_vanilla = database.similarity_search(chosen_collection, query_embeddings, k=k)
              context = rag_utils.create_prompt_milvus(query, search_results_vanilla)

        except Exception as e:
          raise
              
      del encoder
      
      return buildSuccessObject(
          { 'context': context, 'source': source_final },
          "Context là toàn ngữ cảnh được xác định sau khi search. Trong khi đó, source là tài nguyên căn cứ để thiết lập ngữ cảnh"
      )
    
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/determine_collection', e))
  

  def generate(self, query, context, streaming, theme, user_profile, history = []):
    try:
      if theme not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment', 'Chapter_0_and_1', 'Chapter_2', 'Chapter_3']: #LEGACY
        theme = "_" + theme
        
      model_configs = get_llm_configs('ACTIVE')
      model = ChatModel(model_configs)
      
      database = self.__database

      max_tokens = model.max_new_tokens
      
      #-------------------------------------------
      aliases = database.describe_collection(theme)['aliases']
      if len(aliases) > 0:
          theme = aliases[0]
          
      return model.generate(query, context, streaming, max_tokens, history = history, 
                            user_profile=user_profile, theme=theme, 
                            themes_descriptions = database.themes_descriptions)
      
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/generate', e))
