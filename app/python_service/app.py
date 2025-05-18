import os
from flask import Flask # type: ignore
from dotenv import load_dotenv # type: ignore

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
        
        print(f"🕗  --- Initializing application routing ---")

        from routes.v2.generate import main as generateRoute
        from routes.v2.file import main as fileRoute
        from routes.v2.collection import main as collectionRoute
        from routes.v2.params import main as paramsRoute
        
        app.register_blueprint(generateRoute, url_prefix="/generate")
        app.register_blueprint(fileRoute, url_prefix="/file")
        app.register_blueprint(collectionRoute, url_prefix="/collection")
        app.register_blueprint(paramsRoute, url_prefix="/params")
        
        print(f"🕗  --- Initializing application assets ---")
        
        for env_key in OPTIONAL_ENV_VARS:
          app.config[env_key] = os.getenv(env_key, '')
                
        missing_required_vars = []
        for env_key in REQUIRED_ENV_VARS:
            value = os.getenv(env_key)
            if value is None:
                missing_required_vars.append(env_key)
            else:
                app.config[env_key] = value
        
        if missing_required_vars:
          raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_required_vars)}")
        
        print(f" ✔ ---  All things loaded --- ")
        
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