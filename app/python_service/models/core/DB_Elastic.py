import os
import time
from dotenv import load_dotenv
from elasticsearch import Elasticsearch

# Load environment variables from .env file
load_dotenv()
# get environment variables
elastic_user = os.getenv("ELASTIC_USER")
elastic_password = os.getenv("ELASTIC_PASSWORD")
elasticsearch_url = os.getenv("ELASTICSEARCH_URL")
elastic_cert = os.getenv("ELASTIC_CERT")  

class ElasticMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(ElasticMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class Elastic(metaclass=ElasticMeta):
    def __init__(self, max_retries=3, retry_interval=5):
        self.es = Elasticsearch(
            elasticsearch_url,
            basic_auth=(elastic_user, elastic_password),
            verify_certs=True,
            ca_certs=elastic_cert
            )
        self.max_retries = max_retries
        self.retry_interval = retry_interval
        
    def check_connect(self):
        return self.es.ping()
    
    def refresh(self, index_name):
        self.es.indices.refresh(index=index_name)
    
    def reconnect(self):
        retries = 0
        while retries < self.max_retries:
            try:
                self.es = Elasticsearch(
                    elasticsearch_url,
                    basic_auth=(elastic_user, elastic_password),
                    verify_certs=True,
                    ca_certs=elastic_cert
                )
                if self.es.ping():
                    print("Kết nối lại thành công!")
                    return True
            except ConnectionError:
                retries += 1
                print(f"Thử kết nối lại lần {retries} sau {self.retry_interval} giây...")
                time.sleep(self.retry_interval)
        print("Không thể kết nối lại sau nhiều lần thử.")
        return False

    def create_index(self, index_name, settings=None, mappings=None):
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")
            
        if not self.es.indices.exists(index=index_name):
            body = {}
            if settings:
                body['settings'] = settings
            if mappings:
                body['mappings'] = mappings
            self.es.indices.create(index=index_name, body=body)

    def delete_index(self, index_name):
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")        
        if self.es.indices.exists(index=index_name):
            self.es.indices.delete(index=index_name)

    def add_document(self, index_name, document):
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")        
            
        self.es.index(index=index_name, body=document)

    def update_document(self, index_name, document_id, doc):
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")        
            
        self.es.update(index=index_name, id=document_id, body={"doc": doc})

    def delete_document(self, index_name, document_id):
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")
                    
        self.es.delete(index=index_name, id=document_id)

    def search(self, index_name, query):
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")

        return self.es.search(index=index_name, body=query)['hits']['hits']
    
    def getAll(self, index_name): 
        if not self.es.ping():  # Kiểm tra kết nối
            if not self.reconnect():  # Thử kết nối lại nếu mất kết nối
                raise ConnectionError("Không thể kết nối đến Elasticsearch")
            
        return self.es.search(index=index_name, body= {
            'query' : {
                'match_all': {}
            }
        })['hits']['hits']
        

   
# es = Elastic()
# es.create_index(index_name='chat_histories', mappings=mappings)
# if(es.check_connect()) :
#     print(es.search('chat_histories',  {
#             "size": 1,
#             "sort": [
#                 { "histories_created_at": { "order": "desc" } }
#             ],
#             'query' : {
#                 "bool": {
#                     "must": [
#                         { "match": { "histories_model_id": "93ce9156-d2f6-49ad-a8e6-57efecc5fd81" } },
#                         { "match": { "histories_session": "2" } }
#                     ]
#                 }
#             }
#         }))
# else:
#     print('es not connected')