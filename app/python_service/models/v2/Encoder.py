import os
import openai # type: ignore


CACHE_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "...", "models")
)

class Encoder:
    def __init__( self, configs = None ):    
        try:  
            required_keys = {"chat_model_id", "provider", "apikey"}
            if configs is None or not isinstance(configs, dict):
                raise TypeError("Variable must be an object")
            
            if not required_keys.issubset(configs.keys()):
                raise KeyError("The 'configs' parameter must be a dictionary containing the keys: 'chat_model_id', 'provider', and 'apikey'.")
            
            self.configs = configs                      # Object
            self.provider = configs['provider']         # String
            self.model_id = configs["chat_model_id"]    # String
            
            if configs['provider'].lower() == "openai":
                openai.api_key =  configs['apikey'] # os.environ['OPENAI_APIKEY']
                
                def embed(text):
                    response = openai.embeddings.create (
                        model = configs["chat_model_id"],  # "text-embedding-3-large",
                        input = text
                    )
                    return response.data[0].embedding
                
                self.embedding_function = embed
        
        except KeyError as e:
            raise Exception('Cannot init Encoder Object - ', str(e))
        
        except Exception as e:
            raise Exception('Cannot connection with OpenAI - ', str(e))
            
