from flask import current_app # type: ignore

from controllers.helper.getLLMConfigs import get_llm_configs
from controllers.helper.getQueryRouterConfigs import get_queryRouter_configs
from controllers.helper.getEncoderConfigs import get_encoder_configs

from models.v2.ChatModel import ChatModel as ChatModel_v2
from models.v2.QueryRouter import QueryRouter as QueryRouter_v2
from models.v2.Encoder import Encoder as Encoder_v2

from utils import rag_utils

from middlewares.buildErrorObject import buildErrorObject

class Generate_Controller:
  def __init__(self):
    pass
  
  def extract_metadata(self, query = None, chosen_collection = None, history = []):
    try:
      database = current_app.config['DATABASE']
      n_new_queries = 2
      
      model_configs = get_llm_configs('ACTIVE')
      model = ChatModel_v2(model_configs)  
      
      conversation = ""
      for h in history:
          conversation += h['question'] + ".\n"
      conversation += query
      
      is_old_extract = True
      if is_old_extract: #OLD METADATA EXTRACTION
          extracted_metadata = rag_utils.metadata_extraction_v2(query, model, chosen_collection, database=database)

          if extracted_metadata != -1: #No metadata found
              filter_expressions = rag_utils.compile_filter_expression(extracted_metadata, database.persistent_collections + [chosen_collection], database.persistent_collections, latest_timespan_months=database.latest_timespan_months)
          else:
              filter_expressions = {}
          return filter_expressions
      
      rewritten_queries = rag_utils.rewrite_query(conversation=conversation, model=model, k=n_new_queries)
      
      if rewritten_queries == -1:
          extracted_metadata = rag_utils.metadata_extraction_v2(query, model, chosen_collection)
          if extracted_metadata != -1: #No metadata found
              filter_expressions = rag_utils.compile_filter_expression(extracted_metadata, database.persistent_collections + [chosen_collection], database.persistent_collections, latest_timespan_months=database.latest_timespan_months)
          else:
              filter_expressions = {}
          return filter_expressions
      else:
          filter_expressions = []
          for q in rewritten_queries:
              extracted_metadata = rag_utils.metadata_extraction_v2(q, model, chosen_collection)
              if extracted_metadata != -1: #No metadata found
                  expr = rag_utils.compile_filter_expression(extracted_metadata, database.persistent_collections + [chosen_collection], database.persistent_collections, latest_timespan_months=database.latest_timespan_months)
              else:
                  expr = {}
              filter_expressions.append({q: expr})
          return filter_expressions
        
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/extract_metadata', e))
        
  
  def determine_collection(self, query, history, threshold = 0.5): 
    try:      
      db_configs = current_app.config['DATABASE']
      
      model_configs = get_queryRouter_configs('ACTIVE')
      queryrouter = QueryRouter_v2 (
                configs = model_configs, 
                database = db_configs
              )  
      
      conversation = ""
      for h in history:
          conversation += h['question'] + ". "
      conversation += query
        
      if queryrouter.use_history: # Determine using conversation history
        prediction = queryrouter.classify(conversation)  
      else:
          prediction = queryrouter.classify(query)
      if prediction != -1:
          return {'collection': prediction.removeprefix('_')}
      else:
          return {'collection': ""}
        
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/determine_collection', e))
  
  def search(self, query, chosen_collection, filter_expressions, context = "", source_final = []): 
    try:
      # encoder = # current_app.config['ENCODER']
      
      encoder_configs = get_encoder_configs('ACTIVE')
      encoder = Encoder_v2 ( configs = encoder_configs )  
      
      database = current_app.config['DATABASE']
      k = database.k
      
      database.load_collection(chosen_collection)


      if type(filter_expressions) == dict:
          query_embeddings = encoder.embedding_function(query)
          try:
            search_results_final, source_final = database.hybrid_search(
                collection=chosen_collection, 
                query_embeddings=[query_embeddings], 
                k=k,
                limit_per_req=4,
                filters=[filter_expressions],
            )
          except Exception as e:
              print("Error with filter search", str(e))
              print(e)
              search_results_final, source_final, _ = database.similarity_search(chosen_collection, query_embeddings, k=k)
              
          if search_results_final != -1:
              context = rag_utils.create_prompt_milvus(query, search_results_final)
          else:
              context = ""
              source_final = []
              
      elif type(filter_expressions) == list: #Filter expressions contain rewritten queries - perform hybrid search
          search_results_final, source_final, _ = database.hybrid_search(
              collection=chosen_collection, 
              query_embeddings=[encoder.embedding_function(list(q.keys())[0]) for q in filter_expressions], 
              k=k,
              limit_per_req=4,
              filters=[list(q.values())[0] for q in filter_expressions]
              )
          if search_results_final != -1:
              context = rag_utils.create_prompt_milvus(query, search_results_final)
          elif search_results_final == -2: #Error in hybrid search, revert to vanilla search
              search_results_vanilla, source_vanilla, distances_vanilla = database.similarity_search(chosen_collection, query_embeddings, k=k)
              context = rag_utils.create_prompt_milvus(query, search_results_vanilla)
          else:
              context = "No related documents found"
              source_final = []
      del encoder
      
      return context, source_final
    
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/determine_collection', e))
  

  def generate(self, query, context, streaming, theme, user_profile, history = []):
    try:
      if theme not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
        theme = "_" + theme
        
      model_configs = get_llm_configs('ACTIVE')
      model = ChatModel_v2(model_configs)

      database = current_app.config['DATABASE']
      max_tokens = model.max_new_tokens
      
      #-------------------------------------------
      aliases = database.describe_collection(theme)['aliases']
      if len(aliases) > 0:
          theme = aliases[0]
          
      return model.generate(query, context, streaming, max_tokens, history=history, user_profile=user_profile, theme=theme, themes_descriptions=database.themes_descriptions)
      
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Generate_Controller/determine_collection', e))
  
      
