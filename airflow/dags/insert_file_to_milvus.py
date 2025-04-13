# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

from __future__ import annotations

#import datetime

from glob import glob
import os
#from dotenv import load_dotenv
import json

from pymilvus import(
    connections,
    FieldSchema,
    DataType,
    Collection,
    CollectionSchema
)
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

# class Encoder:
#     def __init__(
#         self, model_name: str = "intfloat/multilingual-e5-large", device="cpu",
#         project_id=None, apikey=None
#     ):
#         my_credentials = {
#             "url": "https://us-south.ml.cloud.ibm.com",
#             "apikey": apikey
#         }

#         # model_id = 'sentence-transformers/all-minilm-l12-v2'
#         model_id = 'intfloat/multilingual-e5-large'
#         verify = False

#         # Set the truncate_input_tokens to a value that is equal to or less than the maximum allowed tokens for the embedding model that you are using. If you don't specify this value and the input has more tokens than the model can process, an error is generated.

#         embed_params = {
#             EmbedParams.TRUNCATE_INPUT_TOKENS: 512,
#         }

#         model = Embeddings(
#             model_id=model_id,
#             credentials=my_credentials,
#             params=embed_params,
#             project_id=project_id,
#             verify=verify
#         )
#         self.embedding_function = model


@dag(schedule_interval=None,catchup=False)
def process_file_and_insert():
    # @task(task_id="connect_to_milvus")
    # def connect_to_milvus(**kwargs):
    #     #load_dotenv()
    #     # connections.connect(alias = 'default',
    #     #                         host = Variable.get('MILVUS_HOST'),
    #     #                         port = Variable.get('MILVUS_PORT'),
    #     #                         user = Variable.get('MILVUS_USERNAME'),
    #     #                         password = Variable.get('MILVUS_PASSWORD'),
    #     #                         server_pem_path=Variable.get('MILVUS_SERVER_PEM'),
    #     #                         server_name = Variable.get('MILVUS_SERVER_NAME'),
    #     #                         secure = True)
    #     connections.connect(alias = 'default')
    #     return True

    @task(task_id="read_file_contents")
    def read_file_contents(**kwargs):
        filename = kwargs['dag_run'].conf.get('filename')
        filepath = Variable.get('AIRFLOW_TEMP_FOLDER') + filename
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data

    @task(task_id="embed_file_contents")
    def embed_file_contents(data, **kwargs):
        if Variable.get('ENCODER_PROVIDER') == 'local':
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer('intfloat/multilingual-e5-large')
        #model = Encoder(project_id=Variable.get('WATSONX_PROJECT_ID'), apikey=Variable.get('WATSONX_APIKEY'))
        #embeddings = model.embedding_function.embed_documents(["passage: " + chunk for chunk in data])
            embeddings = model.encode(["passage: " + chunk for chunk in data])
            embeddings = [emb.tolist() for emb in embeddings]
            del model
        elif Variable.get('ENCODER_PROVIDER') == 'openai':
            import openai
            openai.api_key = Variable.get('OPENAI_TOKEN')
            response = openai.embeddings.create(model="text-embedding-3-large", input=data)
            embeddings = [r.embedding for r in response.data]
        return [embeddings, data]

    @task(task_id="insert_file_to_milvus")
    def insert_file_to_milvus(embeds_articles, **kwargs):
        metadata = kwargs['dag_run'].conf.get('metadata')
        collection_name = kwargs['dag_run'].conf.get('collection_name')
        #CONNECT TO MILVUS
        # connections.connect(alias = 'default',
        #                         host = Variable.get('MILVUS_HOST'),
        #                         port = Variable.get('MILVUS_PORT'),
        #                         user = Variable.get('MILVUS_USERNAME'),
        #                         password = Variable.get('MILVUS_PASSWORD'),
        #                         server_pem_path=Variable.get('MILVUS_SERVER_PEM'),
        #                         server_name = Variable.get('MILVUS_SERVER_NAME'),
        #                         secure = True)
        if Variable.get('MILVUS_HOST') != "":
            connections.connect(alias = 'default', host = Variable.get('MILVUS_HOST'), port = Variable.get('MILVUS_PORT'),)
        else:
            connections.connect(alias = 'default', uri=Variable.get('MILVUS_URI'), token=Variable.get('MILVUS_TOKEN'))
        collection = Collection(collection_name)
        schema = collection.describe()['fields']
        meta = {}
        def convert_type(type):
            if type == DataType.INT8 or type == DataType.INT16 or type == DataType.INT32 or type == DataType.INT64:
                return int
            elif type == DataType.FLOAT or type == DataType.DOUBLE:
                return float
            elif type == DataType.VARCHAR or type == DataType.STRING:
                return str
            elif type == DataType.ARRAY:
                return list
            else:
                return 'unknown'
        for attr in schema:
            if attr['name'] in ['id', 'chunk_id', 'embedding', 'article', 'page_number']:
                continue
            value = metadata.get(attr['name'])
            if value is None:
                meta[attr['name']] = '' #TODO: expand more datatypes
            else:
                datatype = convert_type(attr['type'])
                if datatype is list:
                    element_type = convert_type(attr['element_type'])
                    if type(value) is list:
                        meta[attr['name']] = [element_type(val) for val in value]
                    else:
                        meta[attr['name']] = [element_type(value)]
                else:
                    meta[attr['name']] = datatype(value)
        meta['is_active'] = True
        chunk_id_name = 'chunk_id' if collection_name != 'student_handbook' else 'page_number'
        if collection_name == 'student_handbook': #Legacy
            data = [{'embedding': vector, 'article': article, chunk_id_name: i } for i, (vector, article) in enumerate(zip(embeds_articles[0], embeds_articles[1]))]
        else:
            import datetime
            #Convert created_at to unix timestamp
            created_at = metadata.get('created_at')
            if created_at is None:
                created_at = datetime.datetime.now()
            else:
                created_at = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ')
            created_at_unix = int(created_at.timestamp())
            data = [{'embedding': vector, 'article': article, chunk_id_name: i, 'created_at_unix': created_at_unix } for i, (vector, article) in enumerate(zip(embeds_articles[0], embeds_articles[1]))]

        data = [d | meta for d in data]
        collection.insert(data)
        return True

    @task(task_id="delete_file")
    def delete_file(**kwargs):
        filename = kwargs['dag_run'].conf.get('filename')
        filepath = Variable.get('AIRFLOW_TEMP_FOLDER') + filename
        os.remove(filepath)
        return True

    #connect_to_milvus()
    insert_file_to_milvus(embed_file_contents(read_file_contents())) >> delete_file()
    #delete_file()

process_file_and_insert()

