"""
This file contains the configuration for establishing a connection to a MongoDB database.

It includes the necessary settings and parameters required to connect to the MongoDB server,
such as the host, port, authentication credentials, and database name.

Ensure that the configuration values are properly set before using this file to establish
a connection to the database.
"""

import os
from middlewares.buildErrorObject import buildErrorObject

from pymongo import MongoClient # type: ignore

def get_db():
  client = MongoClient(os.getenv("MONGO_CONNECTION_STRING", 'mongodb://admin_chatbot:admin_chatbot@localhost:27017/chatbot_app?authMechanism=DEFAULT'))
  
  print(f"\n⏳ Loading Mongo Database ...")
  try:
    db = client[os.getenv("APP_DATABASE", 'chatbot_app')]
    print(f"📚 Số collections trong DB: ", len(db.list_collection_names()))
    print(f"✅ Kết nối MongoDB thành công!")
      
    return db
  except Exception as e:
    raise Exception(buildErrorObject("Lỗi khi khởi tạo kết nối đến MongoDB", str(e)))
  
class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(SingletonMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class MONGODB(metaclass=SingletonMeta):
    def __init__(self):
        self.model = get_db()
    
    def getDB(self): 
      return self.model