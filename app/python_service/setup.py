import os
from flask import Flask
from dotenv import load_dotenv

from app.python_service.routes.v1.generate import main as generateRoute
from routes.initRoutes  import main as initRoute

from models.model import QueryRouter
from utils import rag_utils

# Load environment variables from .env file
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
load_dotenv()

# get environment variables
username = os.getenv("AUTHOR")
# elastic_password = os.getenv("ELASTIC_PASSWORD")
# elasticsearch_url = os.getenv("ELASTICSEARCH_URL")
# elastic_cert = os.getenv("ELASTIC_CERT")


def createApp():
    try:
        app = Flask(__name__)

        app.config["CORS_HEADERS"] = "Content-Type"

        app.register_blueprint(initRoute, url_prefix="/")  # Register blueprint with routes
        app.register_blueprint(generateRoute, url_prefix="/generate")
        
        # app.register_blueprint(initRoutes)  # Register blueprint with routes

        # Initialize Elasticsearch connection
        # elastic = Elastic()
        # print(f"Connect to Elasticsearch: {elastic.check_connect()}")


        # -------------- Store connection, embedding in app's config -------------- #
        # model_embedding = SentenceTransformer("intfloat/e5-small-v2")
        # app.config["EMBEDDING_MODEL"] = model_embedding  # setup global variable

        # -------------- Store connection, chunking in app's config --------------- #
        # model_chunking = HuggingFaceBgeEmbeddings(
        # model_name="BAAI/bge-small-en",  #
        # model_kwargs={"device": "cpu"},
        # encode_kwargs= {'normalize_embeddings': True}  # config to normalize
        # )
        # app.config["CHUNKING_MODEL"] = model_chunking  # setup global variable

        # Initial Admin Object + reload database if server shuts down.
        # admin_controler = Admin()

        # app.config["RERANKING_MODEL"] = FlagReranker(
        # "BAAI/bge-reranker-v2-m3", use_fp16=True
        # )
        
        # ===========================
        print("---LOADING ASSETS---")
        # ===========================
        # ========== LOAD CHAT MODEL ==========================
        # model = ChatModel(provider=os.getenv("PROVIDER"), model_id=os.getenv("CHAT_MODEL_ID"))
        # app.config["CHAT_MODEL"] = model
        # print("Chat model loaded.")
        
        # ===========================
        # ========== LOAD ENCODER ==========================
        try:
            encoder = rag_utils.Encoder(provider=os.getenv("EMBED_PROVIDER", "local"))
            app.config["ENCODER"] = encoder
            print(f"Encoder loaded - mode {os.getenv('EMBED_PROVIDER', 'local')}")
        except Exception as e: 
            raise Exception(f"Failed to load encoder: {e}")

        # ===========================
        # ========== LOAD MILVUS DB ==========================
        database = rag_utils.MilvusDB(
            host=os.getenv('MILVUS_HOST', ""), 
            port=os.getenv('MILVUS_PORT', ""),
            user=os.getenv('MILVUS_USERNAME', ""), 
            password=os.getenv('MILVUS_PASSWORD', ""),
            uri=os.getenv('MILVUS_URI', ""), 
            token=os.getenv('MILVUS_TOKEN', "")
        )

        collections = database.list_collections()
        print(collections)
        if 'student_handbook' in collections:
            database.load_collection('student_handbook', persist=True)
            app.config["DATABASE"] = database
            print(f"✅ Database loaded successfully - {os.getenv('MILVUS_HOST', '')}:{os.getenv('MILVUS_PORT', '')}")
        else:
            raise Exception("⚠️ Collection 'student_handbook' not found in Milvus.")
        
        
        # ===========================
        # ========== LOAD QUERY ROUTER ==========================
        queryrouter = QueryRouter(provider=os.getenv("QUERYROUTER_PROVIDER", "local"), 
                                model_id=os.getenv("QUERYROUTER_MODEL_ID", None), database=database)
        app.config["QUERYROUTER"] = queryrouter
        print("Query Router loaded - ", os.getenv("QUERYROUTER_PROVIDER", "local"), os.getenv('QUERYROUTER_MODEL_ID', None))
        
        # ===========================    
        print("All assets loaded.")
        # ===========================    
        
        return app
    
    except:
        print('Error in setup - ', str(e))
        raise e