import json

from flask import current_app # type: ignore

from middlewares import buildErrorObject

from controllers.handler.milvus_handler import Milvus_Handler




class Collection_Controller:
  def __init__(self):
    self.metadata = {
        "title": {"description": "", "datatype": "string", "params": {"max_length": 700}},
        "article": {"description": "", "datatype": "string", "params": {"max_length": 5000}},
        "embedding": {"description": "", "datatype": "vector", "params": {"dim": 3072}}, #1024
        "url": {"description": "", "datatype": "string", "params": {"max_length": 300}},
        "chunk_id": {"description": "", "datatype": "int", "params": {}},
        "created_at": {"description": "", "datatype": "string", "params": {"max_length": 50}},
        "updated_at": {"description": "", "datatype": "string", "params": {"max_length": 50}},
        "is_active": {"description": "", "datatype": "bool", "params": {}}, #Float,int,string,list,bool
        "document_id": {"description": "", "datatype": "string", "params": {"max_length": 50}},
        "id": {"description": "", "datatype": "int", "params": {"is_primary": True, "auto_id": True}},
    }
  
  def create_collection(self, name, long_name, description, metadata):
    try:
      custom_metas = [json.loads(item) for item in metadata]
      for custom_meta in custom_metas:
        self.metadata.update(custom_meta)
        
      database = Milvus_Handler()
      database.create_collection(name, long_name, description, metadata)
    
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở Collection_Controller/create_collection', str(e)))
    
    
  def drop_collection(self, collection_name):
    try:
      database = Milvus_Handler()
      return database.drop_collection(collection_name)
    
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở Collection_Controller/drop_collection', str(e)))
  
  def get_schema(self, collection_name, readable=True):
    try:
      database = Milvus_Handler()
      return database.get_collection_schema(collection_name, readable=True)
    
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở Collection_Controller/get_schema', str(e)))
  
  