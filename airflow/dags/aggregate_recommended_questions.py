from __future__ import annotations

#import datetime

from glob import glob
import os
#from dotenv import load_dotenv
import json
#from sentence_transformers import SentenceTransformer
#from ibm_watsonx_ai.metanames import EmbedTextParamsMetaNames as EmbedParams
#from ibm_watsonx_ai.foundation_models import Embeddings

from airflow.models.dag import DAG
from airflow.operators.python import PythonOperator
from airflow.models import Variable
# from airflow.operators.bash import BashOperator
# from airflow.sensors.bash import BashSensor
# from airflow.sensors.filesystem import FileSensor
# from airflow.sensors.base import PokeReturnValue
from airflow.decorators import dag, task
from airflow.utils.dates import days_ago


@dag(schedule_interval="@daily",catchup=False, start_date=days_ago(2))
def aggregate_recommended_questions():
    @task(task_id="retrieve_question_set")
    def retrieve_question_set(**kwargs):
        from pymongo import MongoClient
        client = MongoClient(Variable.get("MONGO_CONNECTION_STRING"))
        db = client[Variable.get("MONGO_DATABASE")]
        pipeline = [
            { "$sort": { "createdAt": -1 } },
            { "$limit": 200 },
            {
                "$group": {
                    "_id": "$question",
                    "count": { "$sum": 1 }
                }
            },
            { "$sort": { "count": -1 } },
            { "$limit": 25 }
        ]
        results = list(db['histories'].aggregate(pipeline))
        return results
    
    @task(task_id="generate_recommended_questions")
    def generate_recommended_questions(results, **kwargs):
        prompt = "You are given a list of questions made by users and the number of times it has appeared. Write 3 questions that represent this list of questions."
        user_prompt = ""
        for result in results:
            user_prompt += f"{result['_id']}: {result['count']}\n"

        response_format = {
            "type": "json_schema",
            "json_schema": {
            "name": "questions_list",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                "questions": {
                    "type": "array",
                    "description": "A list of questions.",
                    "items": {
                    "type": "string",
                    "description": "A single question."
                    }
                }
                },
                "required": [
                "questions"
                ],
                "additionalProperties": False
            }
        }}
        import openai
        openai.api_key = Variable.get("OPENAI_TOKEN")
        response = openai.chat.completions.create(
            model="gpt-4o",
            response_format=response_format,
            messages=[
                { "role": "system", "content": prompt },
                { "role": "user", "content": user_prompt }
            ]
        ).choices[0].message.content
        response = json.loads(response)
        return response['questions']

    @task(task_id="generate_resource")
    def generate_resource(questions, **kwargs):
        url = "http://" + Variable.get("BACKEND_HOST") + ":" + Variable.get("BACKEND_PORT")
        results = []
        import requests
        for question in questions:
            result = {"question": question, "resource": {}}
            query = question
            #Determine collection
            response = requests.post(url=url + "/generate/determine_collection", data={"query": query, "history": "[]"})
            collection_name = json.loads(response.content)['collection']
            result['resource']['chosen_collections'] = collection_name
            # Extract metadata
            response = requests.post(url=url + "/generate/extract_meta", data={"query": query, "chosen_collection": collection_name, "history": "[]"})
            filter_exprs = response.content
            result['resource']['filter_expressions'] = response.json()
            # Search
            response = requests.get(url=url + "/generate/search", params={"query": query, "chosen_collection": collection_name, "filter_expressions": filter_exprs})
            obj = response.json()
            context = obj['context']
            source = obj['source']
            result['resource']['context'] = context
            result['source'] = source
            results.append(result)
        
        return results

    @task(task_id="insert_recommended_questions")
    def insert_recommended_questions(recommended_questions, **kwargs):
        from pymongo import MongoClient
        client = MongoClient(Variable.get("MONGO_CONNECTION_STRING"))
        db = client[Variable.get("MONGO_DATABASE")]
        db['recommended_questions'].insert_many(recommended_questions)
        return True

    insert_recommended_questions(generate_resource(generate_recommended_questions(retrieve_question_set())))

aggregate_recommended_questions()
