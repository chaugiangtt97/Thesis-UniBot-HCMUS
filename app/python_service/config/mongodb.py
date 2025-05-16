"""
This file contains the configuration for establishing a connection to a MongoDB database.

It includes the necessary settings and parameters required to connect to the MongoDB server,
such as the host, port, authentication credentials, and database name.

Ensure that the configuration values are properly set before using this file to establish
a connection to the database.
"""

from flask import current_app # type: ignore

from middlewares.buildErrorObject import buildErrorObject

from pymongo import MongoClient # type: ignore

class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(SingletonMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class MONGODB(metaclass=SingletonMeta):
    def __init__(self):
      connection_string = current_app.config.get('MONGO_CONNECTION_STRING') or 'mongodb://admin_chatbot:admin_chatbot@localhost:27017/chatbot_app?authMechanism=DEFAULT'
      database_name = current_app.config.get('APP_DATABASE') or 'chatbot_app'
      
      try:
        print(f"\n⏳ Loading Mongo Database ...")
        client = MongoClient(connection_string)
        
        print(f"📚 Số collections trong DB: ", len(client[database_name].list_collection_names()))
        print(f"✅ Kết nối MongoDB thành công!")
          
        self.client = client
        
        self.MONGO_CONNECTION_STRING = connection_string
        self.DATABASE = database_name
        
      except Exception as e:
        raise Exception(buildErrorObject("Lỗi khi khởi tạo kết nối đến MongoDB", str(e)))
    
    def get_handler(self):
      return self.client[self.DATABASE]
    
    def close(self):
      if self.client:
          self.client.close()