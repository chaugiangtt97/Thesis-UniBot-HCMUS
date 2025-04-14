import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline
from dotenv import load_dotenv
from .prompts import prompts

from flask import Response, stream_with_context, current_app
import json

load_dotenv('../.env')


CACHE_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
)

class ChatModel:
    def __init__(self, model_id: str = "mistralai/mistral-large", device="cuda", provider="IBM", max_new_tokens=1500):
        self.provider = provider
        self.max_new_tokens = max_new_tokens
        if provider == "IBM":
            from ibm_watsonx_ai.foundation_models import ModelInference
            from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
            credentials = {
                "apikey": os.getenv("WATSONX_APIKEY"),
                "url": "https://us-south.ml.cloud.ibm.com",
            }

            self.model = ModelInference(
                model_id=model_id,
                credentials=credentials,
                params={
                    GenParams.DECODING_METHOD: "greedy",
                    GenParams.MAX_NEW_TOKENS: 2048,
                    # GenParams.STOP_SEQUENCES: [],
                },
                project_id=os.getenv("WATSONX_PROJECT_ID"),
            )
        elif provider == "OpenAI":
            import openai
            client = openai.OpenAI(api_key=os.getenv("OPENAI_APIKEY"))
            self.model = client
            self.model_id = model_id
            # response = client.chat.completions.create(
            #     model="gpt-4o-mini",
            #     messages=[{"role": "system", "content": prompt}],
            #     stream=False,
            # )
            # print(response.choices[0].message.content)
        elif provider == "Google":
            import google.generativeai as genai

            genai.configure(api_key=os.getenv("GEMINI_APIKEY"))
            self.model = genai.GenerativeModel(model_id)
            # response = model.generate_content("Explain how AI works", )
            # print(response.text)

    def _generate(self, prompt, max_new_tokens=1000, history=None, streaming=False, response_schema=None):
        if self.provider.lower() == "ibm":
            params = {GenParams.MAX_NEW_TOKENS: max_new_tokens}
            if not streaming:
                response = self.model.generate_text(prompt, params=params)
                #response = response.replace("<eos>", "")  # remove eos token
                return response
            else:
                return self.model.generate_text_stream(prompt, params=params)
        elif self.provider.lower() == "openai":
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
                # print("Streaming response")
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
                return stream_with_context(gen())
        elif self.provider.lower() == "google":
            import google.generativeai as genai
            params = genai.GenerationConfig(max_output_tokens=max_new_tokens)
            if not streaming:
                return self.model.generate_content(prompt, stream=streaming).text
            else:
                def gen():
                    response = self.model.generate_content(prompt, stream=streaming)
                    for chunk in response:
                        yield f"{chunk.text}"
                return stream_with_context(gen())

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

        # formatted_prompt = prompt.replace("\n", "<eos>")
        #formatted_prompt = prompt.format(context=context, question=question)
        return self._generate(formatted_prompt, max_new_tokens, streaming=streaming)

class QueryRouter:
    def __init__(self, model_dir: str = CACHE_DIR, threshold=0.5, use_history=True, provider='local', model_id=None, database=None):
        if provider == 'local':
            self.model = pipeline('text-classification', model=model_dir + "/phobert_queryrouting")

        elif provider.lower() == 'openai':
            import openai
            client = openai.OpenAI(api_key=os.getenv("OPENAI_APIKEY"))
            self.model = client
            self.model_id = model_id if model_id is not None else "gpt-4o"
            # Creating prompt for query routing
            assert database is not None, "Database object must be provided for query routing"
            collections = database._handler.list_collections()
            # Remove student_handbook from collections
            collections.remove('student_handbook')
            descriptions = [database.describe_collection(col)['description'] for col in collections]
            describe_collections_prompt = "".join([f"{col}: {desc}\n" for col, desc in zip(collections, descriptions)])
            self.prompt = f"""You are given the conversation between a user and a chatbot. Your task is to classify the conversation into one of the following topics:
{describe_collections_prompt}Note that the conversation might span across multiple topics, ONLY answer with the latest topic. Do not provide an explanation, only the topic name."""
            self.collections = collections
        else:
            self.model = pipeline('text-classification', model=model_dir + "/phobert_queryrouting")
        #Setting parameters
        self.threshold = threshold
        self.use_history = use_history
        self.provider = provider

    def classify(self, query):
        if self.provider.lower() == 'local':
            from utils import query_routing
            segmented_query = query_routing.segment_vietnamese(query)
            if type(segmented_query) is list:
                segmented_conversation = " ".join(segmented_query)
            else:
                segmented_conversation = segmented_query
            prediction = self.model(segmented_conversation)[0]
            chosen_collection = prediction['label']
            print("Query Routing: " + chosen_collection + " ----- Score: " + str(prediction['score']) + "\n")
            if prediction['score'] > self.threshold:
                return chosen_collection
            else: #Low confidence
                return -1

        elif self.provider.lower() == 'openai':
            # response = self.model.chat.completions.create(
            #     model=self.model_id,
            #     messages=[{"role": "system", "content": self.prompt}, {"role": "user", "content": query}],
            #     stream=False,
            # ).choices[0].message.content.lower()
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
            print("Query Routing: " + response['collection'] + "\n")
            if response['collection'] in self.collections:
                return response['collection']
            else: #Unable to classify
                return -1
