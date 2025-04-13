#!/usr/bin/env bash

source .env

# Removing network
# docker network disconnect myNetwork milvus-standalone
# docker network disconnect myNetwork $(basename $(pwd))-airflow-worker-1
# docker network remove myNetwork

mkdir -p ./dags ./logs ./plugins ./config ./tmp

# STARTING AIRFLOW
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.10.3/docker-compose.yaml'
sed -i -e 's/image: $/#image: $/g' docker-compose.yaml
sed -i -e 's/# build/build/g' docker-compose.yaml
#sed -i -e '172s@$@    volumes:\n      - type: bind\n        source: /static\n        target: '$AIRFLOW_VAR_AIRFLOW_TEMP_FOLDER'\n@g' docker-compose.yaml
sed -i -e '79s@$@\n    - '$(pwd)/tmp':/home/tmp\n@g' docker-compose.yaml


echo -e "AIRFLOW_UID=$(id -u)" >> .env

#Migrate databases and create admin with user-password=airflow-airflow
docker compose up airflow-init

#Start all services
docker compose up --build -d
#Airflow sh for easier command line calls
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.10.3/airflow.sh'
chmod +x airflow.sh

until [ "`docker inspect -f {{.State.Health.Status}} $(basename $(pwd))-airflow-worker-1`"=="healthy" ]; do
    sleep 1;
done;
#Set environment variables
./airflow.sh variables set AIRFLOW_TEMP_FOLDER "/home/tmp/"
./airflow.sh variables set MILVUS_HOST $MILVUS_HOST
# ./airflow.sh variables set MILVUS_PASSWORD $AIRFLOW_VAR_MILVUS_PASSWORD
./airflow.sh variables set MONGO_CONNECTION_STRING $MONGO_CONNECTION_STRING
./airflow.sh variables set MONGO_DATABASE $MONGO_DB
./airflow.sh variables set OPENAI_TOKEN $OPENAI_TOKEN
./airflow.sh variables set MILVUS_PORT $MILVUS_PORT
./airflow.sh variables set BACKEND_HOST $BACKEND_HOST
./airflow.sh variables set BACKEND_PORT $BACKEND_PORT
./airflow.sh variables set ENCODER_PROVIDER $ENCODER_PROVIDER
# ./airflow.sh variables set MILVUS_USERNAME $AIRFLOW_VAR_MILVUS_USERNAME
# ./airflow.sh variables set WATSONX_APIKEY $AIRFLOW_VAR_WATSONX_APIKEY
# ./airflow.sh variables set WATSONX_PROJECT_ID $AIRFLOW_VAR_WATSONX_PROJECT_ID
# ./airflow.sh variables set VLLM_URL $AIRFLOW_VAR_VLLM_URL
# Unpause DAGS
./airflow.sh dags unpause process_file_and_insert
./airflow.sh dags unpause aggregate_recommended_questions

#Create new user for API
./airflow.sh users create \
          --username $API_USERNAME \
          --firstname $API_USERNAME \
          --lastname $API_USERNAME \
          --role Admin \
          --email admin@example.org \
          --password $API_PASSWORD

# Create network and connect to milvus
# docker network create myNetwork
# docker network connect myNetwork milvus-standalone --alias milvus
# docker network connect myNetwork $(basename $(pwd))-airflow-worker-1 --alias airflow