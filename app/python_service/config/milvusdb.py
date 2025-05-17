# """
# This file contains the configuration for establishing a connection to a Milvus database.

# It includes the necessary settings and parameters required to connect to the Milvus server,
# such as the host, port, authentication credentials, and database name.

# Ensure that the configuration values are properly set before using this file to establish
# a connection to the database.
# """

from flask import current_app # type: ignore

from pymilvus import( connections, Collection, DataType ) # type: ignore

class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(SingletonMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class MilvusDB(metaclass=SingletonMeta):
  
    __handler = None
    
    def __init__(self) -> None:
      try:
        
        milvus_uri = current_app.config.get('MILVUS_URI')
        milvus_token = current_app.config.get('MILVUS_TOKEN')
        milvus_host = current_app.config.get('MILVUS_HOST')
        milvus_port = current_app.config.get('MILVUS_PORT')
      
        if not ((milvus_port and milvus_host) or (milvus_uri and milvus_token)):
            raise EnvironmentError("Either 'MILVUS_URI' or both 'MILVUS_HOST' and 'MILVUS_PORT' must be provided.")
        
        print(f"\n⏳   Loading Milvus Database ...")
        if milvus_uri: #Remote Zilliz cloud connection
            connections.connect(alias = 'default', uri = milvus_uri, token = milvus_token )
        else: 
            connections.connect(alias = 'default', host = milvus_host, port = milvus_port)

        self.__handler = connections._fetch_handler('default')
        
        self.connections = connections
        self.DataType = DataType
        self.Collection = Collection
        
        print("✅   Đã kết nối Milvus.")
      
      except EnvironmentError as e: 
        print("⚠️   Kết nối Milvus thất bại", str(e))
        raise e 
      
      except Exception as e:
        print("⚠️   Kết nối Milvus thất bại", str(e))
        raise e
     
    def get_handler(self):
      try:
        if connections.has_connection(alias="default"):
          return self.__handler
        raise RuntimeError("⚠️ Không thể lấy datatype khi chưa kết nối milvus")
      except Exception as e: 
        raise e
      
    def close(self):
      try:
        self.connections.disconnect(alias='default')
        print(f"✅   Đã đóng kết nối Milvus.")
      except Exception as e: 
        print(f"❌   Đóng kết nối Milvus thất bại", str(e))
        raise e