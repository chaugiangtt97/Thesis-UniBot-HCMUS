FROM apache/airflow:2.10.3
ADD requirements.txt .
RUN pip install --no-cache-dir --upgrade apache-airflow==${AIRFLOW_VERSION} -r requirements.txt
#RUN pip cache purge
RUN pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir sentence-transformers==3.3.1
