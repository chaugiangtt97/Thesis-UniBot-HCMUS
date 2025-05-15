import openai # type: ignore

from ..prompts import prompts


"""
Initializes the ChatModel instance with the provided configuration.
Args:
    configs (dict, optional): A dictionary containing the configuration for the chat model. 
        Must include the following keys:
        - "chat_model_id" (str): The identifier for the chat model.
        - "provider" (str): The provider of the chat model (e.g., "OpenAI").
        - "apikey" (str): The API key for accessing the provider's services.
Raises:
    KeyError: If `configs` is not a dictionary or does not contain the required keys.
    Exception: If an error occurs during initialization.
"""
class ChatModel:
    def __init__(self, configs = None, max_new_tokens=1500):
        try:
            required_keys = {"chat_model_id", "provider", "apikey"}
            if configs is None or not isinstance(configs, dict):
                raise TypeError("Variable must be an object")
            
            if not required_keys.issubset(configs.keys()):
                raise KeyError("The 'configs' parameter must be a dictionary containing the keys: 'chat_model_id', 'provider', and 'apikey'.")
            
            self.configs = configs                      # Object
            self.provider = configs['provider']         # String
            self.model_id = configs["chat_model_id"]    # String
            
            self.max_new_tokens = max_new_tokens
            
            if configs['provider'].lower() == "openai":
                try: 
                    model_connected = openai.OpenAI(api_key=configs["apikey"])
                    self.model = model_connected

                    print("\n✅ _Tạo kết nối OpenAI thành công ")

                except Exception as e:
                    print("❌ _ChatModel khởi tạo, Kết nối với OpenAI thất bại:", e)
            
        except KeyError as e:
            raise Exception('Cannot init ChatModel Object - ', str(e))
        
        except Exception as e:
            raise Exception('Cannot connection with OpenAI - ', str(e))

    def _generate(self, prompt, max_new_tokens=1000, history=None, streaming=False, response_schema=None):
        if self.provider.lower() == "openai":
            if response_schema is not None:
                response = self.model.beta.chat.completions.parse(
                    model=self.model_id,
                    response_format=response_schema,
                    messages=[{"role": "system", "content": prompt}],
                )
                return response.choices[0].message.parsed
            if not streaming:
                # print("Non-streaming response")
                response = self.model.chat.completions.create(
                    model=self.model_id,
                    messages=[{"role": "system", "content": prompt}],
                    stream=streaming,
                    max_completion_tokens=max_new_tokens,
                )
                text = response.choices[0].message.content
                return text
            
            else:
                def gen():
                    response = self.model.chat.completions.create(
                        model=self.model_id,
                        messages=[{"role": "system", "content": prompt}],
                        stream=streaming,
                        max_completion_tokens=max_new_tokens,
                    )
                    for chunk in response:
                        if chunk.choices[0].delta.content is not None:
                            yield chunk.choices[0].delta.content
                            
                return gen()

    def generate(self, question: str, context: str = None, streaming=False, max_new_tokens=2048, k=3, history=None, 
                 theme=None, theme_context=None, themes_descriptions=None, user_profile=None):

        if context == None or context == "":
            if history is None or len(history) == 0:
                prompt = prompts['NO_CONTEXT_NO_HISTORY']
                print("Chosen prompt style: NO_CONTEXT_NO_HISTORY")
                formatted_prompt = prompt.format(question=question, user_profile=user_profile, themes_descriptions=themes_descriptions)
            else:
                prompt = prompts['NO_CONTEXT_HISTORY']
                print("Chosen prompt style: NO_CONTEXT_HISTORY")
                conversation = ""
                for pair in history:
                    conversation = conversation + "\nUser: " + pair['question'] + "\nChatbot: " + pair['anwser'] #answer
                formatted_prompt = prompt.format(history=conversation, question=question, user_profile=user_profile, themes_descriptions=themes_descriptions)
        else:
            if history is None or len(history) == 0:
                prompt = prompts['CONTEXT_NO_HISTORY']
                print("Chosen prompt style: CONTEXT_NO_HISTORY")
                formatted_prompt = prompt.format(context=context, question=question, theme=theme, user_profile=user_profile, themes_descriptions=themes_descriptions)
            else:
                prompt = prompts['CONTEXT_HISTORY_FULL']
                print("Chosen prompt style: CONTEXT_HISTORY_FULL")
                conversation = ""
                for pair in history:
                    conversation = conversation + "\nUser: " + pair['question'] + "\nChatbot: " + pair['anwser']
                formatted_prompt = prompt.format(context=context, history=conversation, question=question, theme=theme, user_profile=user_profile, themes_descriptions=themes_descriptions)

        return self._generate(formatted_prompt, max_new_tokens, streaming=streaming)