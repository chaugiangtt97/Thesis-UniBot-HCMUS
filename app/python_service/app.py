import os
from flask import Flask # type: ignore
from dotenv import load_dotenv # type: ignore

from routes.v2.generate import main as generateRoute
# from routes.v2.file import main as fileRoute
# from routes.v2.collection import main as collectionRoute

from utils import rag_utils

load_dotenv()

REQUIRED_ENV_VARS = [
    "AIRFLOW_HOST", "AIRFLOW_PORT",
    "AIRFLOW_USERNAME", "AIRFLOW_PASSWORD",
    "AIRFLOW_TEMP_FOLDER", "AIRFLOW_DAGID_INSERT"
]

OPTIONAL_ENV_VARS = [
    "MILVUS_HOST", "MILVUS_PORT",
    "MILVUS_URI", "MILVUS_TOKEN"
    "MILVUS_USERNAME", "MILVUS_PASSWORD",
    "APP_DATABASE", "MONGO_CONNECTION_STRING", 
    "SEARCH_THRESHOLD", "LATEST_TIMESPAN_MONTHS"
]

def createApp():
    try:
        app = Flask(__name__)

        app.config["CORS_HEADERS"] = "Content-Type"

        app.register_blueprint(generateRoute, url_prefix="/generate")
        # app.register_blueprint(fileRoute, url_prefix="/file")
        # app.register_blueprint(collectionRoute, url_prefix="/collection")
        
        # ===========================
        print("---LOADING ASSETS---")
        # ===========================
        
        missing_optional_vars = []
        for env_key in OPTIONAL_ENV_VARS:
            value = os.getenv(env_key)
            if value is None:
                missing_optional_vars.append(env_key)
            else:
                app.config[env_key] = value
                
        missing_required_vars = []
        for env_key in REQUIRED_ENV_VARS:
            value = os.getenv(env_key)
            if value is None:
                missing_required_vars.append(env_key)
            else:
                app.config[env_key] = value
        
        if missing_required_vars:
          raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_required_vars)}")
        
        if not ({"MILVUS_URI", "MILVUS_TOKEN"}.issubset(missing_optional_vars) or {"MILVUS_HOST", "MILVUS_PORT"}.issubset(missing_optional_vars)):
            raise EnvironmentError("Either 'MILVUS_URI' or both 'MILVUS_HOST' and 'MILVUS_PORT' must be provided.")
        
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
        print('Setup error - ', str(e))
        raise Exception(e)
    except EnvironmentError as e:
        print('Environment error: ', str(e))
        raise Exception(e)
    

if __name__ == "__main__":
    try:
        app = createApp()
        app.run(debug=False,  host="0.0.0.0", port=5000)
    except Exception as e: 
        raise e