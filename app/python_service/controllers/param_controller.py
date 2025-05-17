from flask import current_app # type: ignore

from middlewares.buildSuccessObject import buildSuccessObject
from middlewares.buildErrorObject import buildErrorObject

from models.v2.ChatModel import ChatModel_v2 as ChatModel
from models.v2.QueryRouter import QueryRouter_v2 as QueryRouter

from controllers.helper.getLLMConfigs import get_llm_configs
from controllers.helper.getQueryRouterConfigs import get_queryRouter_configs

from controllers.handler.milvus_handler import Milvus_Handler


class Params_Controller:
  def __init__(self):
    try:
      queryrouter_configs = get_queryRouter_configs('ACTIVE')
      chatmodel_configs = get_llm_configs('ACTIVE')

      database = Milvus_Handler()
      queryRouter = QueryRouter (configs = queryrouter_configs, database = database) 
      chatmodel = ChatModel(chatmodel_configs)
      
      self.__queryRouter = queryRouter
      self.__chatmodel = chatmodel
      self.__database = database
       
    except Exception as e: 
      raise Exception("Không thể khởi tạo Params_Controller", str(e)) 

    
  def update(self, max_tokens=1500, use_history = False, threshold = 0.5, k = 4, filter_bias = 0.4):
    try:
      database = self.__database
      queryRouter = self.__queryRouter
      chatmodel = self.__chatmodel
      
      database = self.__database
      database.k = int(k)                       # TODO: Update k
      database.filter_bias = float(filter_bias) # TODO: Update filter_bias
      
      queryRouter.threshold = float(threshold)  # TODO: Update threshold
      queryRouter.use_history = use_history     # TODO: Update use_history
      chatmodel.max_new_tokens = int(max_tokens) # TODO: Update max_new_tokens
      

      
      return buildSuccessObject({
        'threshold': float(threshold),
        'use_history': use_history,
        'max_tokens':  int(max_tokens),
        'k': int(k),
        'filter_bias': float(filter_bias)
    })
    
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Params_Controller/update', e))
  

  def list(self):
    try:
      database = self.__database
      queryRouter = self.__queryRouter
      chatmodel = self.__chatmodel
      
      return buildSuccessObject({
        'threshold': queryRouter.threshold,
        'use_history': queryRouter.use_history,
        'max_tokens': chatmodel.max_new_tokens,
        'k': database.k,
        'filter_bias': database.filter_bias
      })
    
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở Params_Controller/list', e))
  
  