import json
import openai # type: ignore
import os

from transformers import pipeline

CACHE_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
)

class QueryRouter:
    def __init__(self, configs = None, model_dir: str = CACHE_DIR, threshold=0.5, use_history=True, database=None):
        try:
            required_keys = {"chat_model_id", "provider", "apikey"}
            if configs is None or not isinstance(configs, dict):
                raise TypeError("Variable must be an object")
            
            if not required_keys.issubset(configs.keys()):
                print(configs)
                raise KeyError("The 'configs' parameter must be a dictionary containing the keys: 'chat_model_id', 'provider', and 'apikey'.")
            
            #Setting parameters
            self.configs = configs                      # Object
            self.provider = configs['provider']         # String
            self.model_id = configs["chat_model_id"]    # String  
            
            if configs['provider'].lower() == 'local':
                self.model = pipeline('text-classification', model=model_dir + "/phobert_queryrouting")

            elif configs['provider'].lower() == 'openai':
                self.model = openai.OpenAI(api_key=configs["apikey"])
                self.model_id = configs["chat_model_id"] # model_id if model_id is not None else "gpt-4o"
                
                # Creating prompt for query routing
                assert database is not None, "Database object must be provided for query routing"
                collections = database._handler.list_collections()
                
                # Remove student_handbook from collections
                collections.remove('student_handbook')
                descriptions = [database.describe_collection(col)['description'] for col in collections]
                describe_collections_prompt = "".join([f"{col}: {desc}\n" for col, desc in zip(collections, descriptions)])
                
                self.prompt = f"""You are given the conversation between a user and a chatbot. Your task is to classify the conversation 
                into one of the following topics: {describe_collections_prompt}. Note that the conversation might span across multiple 
                topics, ONLY answer with the latest topic. Do not provide an explanation, only the topic name."""
                
                self.collections = collections
                
            else:
                self.model = pipeline('text-classification', model=model_dir + "/phobert_queryrouting")
            
            self.threshold = threshold
            self.use_history = use_history
            
        except KeyError as e:
            raise Exception('Cannot init QueryRouter Object - ', str(e))
        
        except Exception as e:
            raise Exception('Cannot connection with OpenAI - ', str(e))

    def classify(self, query):
        try:
            if self.provider.lower() == 'openai':
                response_schema = {
                    "type": "json_schema",
                    "json_schema": {
                    "name": "collection_schema",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                        "collection": {
                            "type": "string",
                            "enum": self.collections,
                            "description": "The id of the collection, must be one of the specified options."
                        }
                        },
                        "required": [
                        "collection"
                        ],
                        "additionalProperties": False
                    }
                    }}
                response = self.model.chat.completions.create(
                        model=self.model_id,
                        response_format=response_schema,
                        messages=[{"role": "system", "content": [{"type": "text", "text": self.prompt}]},
                                {"role": "user", "content": [{"type": "text", "text": query}]}
                                ],
                    ).choices[0].message.content
                response = json.loads(response)
                
                # ------------------------------------
                #
                print("Query Routing: " + response['collection'] + "\n")
                #
                # ------------------------------------
                
                if response['collection'] in self.collections:
                    return response['collection']
                else: #Unable to classify
                    return -1
            else: 
                raise Exception('QueryRouter Provider được cung cấp không được hỗ trợ: ', str(self.provider.lower()))
            
        except Exception as e: 
            raise Exception('Exception - ', str(e) )