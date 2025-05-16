import json
import requests # type: ignore
from requests.auth import HTTPBasicAuth # type: ignore

from flask import current_app # type: ignore
from werkzeug.utils import secure_filename # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore

from middlewares.buildErrorObject import buildErrorObject

from controllers.handler.milvus_handler import Milvus_Handler
from controllers.helper.getLLMConfigs import get_llm_configs

from models.v2 import ChatModel

from utils.v2 import rag_utils_v2 as rag_utils


class File_Controller:
  def __init__(self):
    self.AIRFLOW_HOST = current_app.config.get('AIRFLOW_HOST')
    self.AIRFLOW_PORT = current_app.config.get('AIRFLOW_PORT')
    self.AIRFLOW_USERNAME = current_app.config.get('AIRFLOW_USERNAME', ' ')
    self.AIRFLOW_PASSWORD = current_app.config.get('AIRFLOW_PASSWORD', ' ')
    self.AIRFLOW_TEMP_FOLDER = current_app.config.get('AIRFLOW_TEMP_FOLDER', ' ')
    self.AIRFLOW_DAGID_INSERT = current_app.config.get('AIRFLOW_DAGID_INSERT', ' ')


  def get_file(self, filename, collection_name):
    try:
      chunks = rag_utils.get_document(filename, collection_name)
      return chunks
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở File_Controller/get_file', str(e)))
  
  
  def insert_file(self, filename, metadata, collection_name, chunks):
    try:
      if not secure_filename(filename):
        raise SystemError('Tên file không hợp lệ')
      
      if secure_filename(filename):
        title = metadata['title']
        chunks = ["Title: " + title + "\nArticle: " + c for c in chunks]
        
        if not ( self.AIRFLOW_TEMP_FOLDER and self.AIRFLOW_PORT and self.AIRFLOW_DAGID_INSERT ):
          raise ValueError('Milvus Variable is empty!')
        
        with open(self.AIRFLOW_TEMP_FOLDER + '/' + filename, 'w+', encoding='utf-8') as f:
            json.dump(chunks, f)
            r = requests.post(f"http://{self.AIRFLOW_HOST}:{self.AIRFLOW_PORT}/api/v1/dags/{self.AIRFLOW_DAGID_INSERT}/dagRuns", json={
                "conf": {
                    "filename": filename,
                    "collection_name": collection_name,
                    "metadata": metadata
                }},
                auth=HTTPBasicAuth(self.AIRFLOW_USERNAME, self.AIRFLOW_PASSWORD))
            
            response = r.json()

            return {
                'dag_run_id': response['dag_run_id'],
                'dag_id': response['dag_id'],
                'state': response['state']
            }
            
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở File_Controller/insert_file', str(e)))
  
  
  def delete_file(self, document_id, collection_name):
    try:
      database = Milvus_Handler()
      return database.delete_document(document_id=document_id, collection_name=collection_name)
    
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở File_Controller/delete_file', str(e)))
   
    
  def chunk_file(self, text, chunk_size=1500, chunk_overlap=75):
    try:
      splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
      return splitter.split_text(text)
    except Exception as e: 
      raise Exception(buildErrorObject('Lỗi ở File_Controller/chunk_file', str(e)))
    
    
  def enhance(self, collection_name, article):
    try:
      model_configs = get_llm_configs('ACTIVE')
      model = ChatModel(provider= model_configs.provider, model_id=model_configs.chat_model_id)
      
      database = Milvus_Handler()
      pydantic_schema = database.pydantic_collections[collection_name]
      result = rag_utils.enhance_document(article=article, model=model, collection_name=collection_name, pydantic_schema=pydantic_schema)
      
      if result != -1:
          splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=75)
          chunks = splitter.split_text(result['article'])
          result['chunks'] = chunks
          metadata = {}
          for k,v in result.items():
              if k == 'article' or k == 'chunks': continue
              metadata[k] = v

          result['metadata'] = metadata
          return result
        
    except Exception as e:
      raise Exception(buildErrorObject('Lỗi ở File_Controller/enhance', str(e)))
      