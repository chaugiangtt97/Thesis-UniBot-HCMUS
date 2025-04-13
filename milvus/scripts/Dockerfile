FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "start_script.py", "./data/student_handbook_embedded.json",  "./data/FIT_news_final.csv"]