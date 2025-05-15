import os
from flask import Flask # type: ignore
from dotenv import load_dotenv # type: ignore

from routes.v2.generate import main as generateRoute

from utils import rag_utils

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
load_dotenv()

username = os.getenv("AUTHOR")

def createApp():
    try:
        app = Flask(__name__)

        app.config["CORS_HEADERS"] = "Content-Type"

        app.register_blueprint(generateRoute, url_prefix="/generate")
        
        # ===========================
        print("---LOADING ASSETS---")
        # ===========================


        # ===========================
        # ========== LOAD MILVUS DB ==========================  
        print("\n⏳_Loading Vector Database ...")
        database = rag_utils.MilvusDB(
            host=os.getenv('MILVUS_HOST', ""), 
            port=os.getenv('MILVUS_PORT', ""),
            user=os.getenv('MILVUS_USERNAME', ""), 
            password=os.getenv('MILVUS_PASSWORD', ""),
            uri=os.getenv('MILVUS_URI', ""), 
            token=os.getenv('MILVUS_TOKEN', "")
        )
        
        collections = database.list_collections()
        print("_Database collections list - ", len(collections))
        if 'student_handbook' in collections:
            database.load_collection('student_handbook', persist=True)
            app.config["DATABASE"] = database
            print(f"✅_Database loaded successfully - http://{os.getenv('MILVUS_HOST', '')}:{os.getenv('MILVUS_PORT', '')}")
        else:
            raise Exception("⚠️ Collection 'student_handbook' not found in Milvus.")
        # ====================================================  
        # ===========================
        
        print("All assets loaded.")
        
        # ===========================    
        # ====================================================  
        
        return app
    
    except Exception as e:
        print('Error in setup - ', str(e))
        raise Exception(e)