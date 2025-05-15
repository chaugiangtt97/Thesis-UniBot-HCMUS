# FROM openjdk:17-slim



# RUN apt-get update && \
#     apt-get install -y openjdk-17-jdk && \
#     apt-get clean

# # Set JAVA_HOME
# ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
# ENV PATH=$JAVA_HOME/bin:$PATH
 
FROM python:3.10.12-slim

# RUN apt-get update && \
#     apt-get install -y software-properties-common && \
#     add-apt-repository -y ppa:openjdk-r/ppa && \
#     apt-get install -y default-jdk && \
#     apt-get clean

# # Set JAVA_HOME
# ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
# ENV PATH=$JAVA_HOME/bin:$PATH

WORKDIR /app
 
COPY requirements.txt .

# Tải sẵn mô hình SentenceTransformer

RUN pip install --no-cache-dir -r requirements.txt  --extra-index-url https://download.pytorch.org/whl/cpu

COPY . .

CMD ["python", "app.py"]