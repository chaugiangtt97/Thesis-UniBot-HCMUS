from flask import current_app
from datetime import datetime, timezone, timedelta
from PyPDF2 import PdfReader
from docx import Document
from io import BytesIO


"""
Function to embedding a text to vectors.

Args:
    data (str): The text string to be segmented.

Returns:
    vectors: Vector format for text.
"""
def embedding(content):
    #create model
    model = current_app.config['EMBEDDING_MODEL']

    #encode data
    vectors = model.encode(content)
    return vectors 



def get_curent_time():

    # Get the current time in the UTC time zone
    now_utc = datetime.now(timezone.utc)

    # Convert to Vietnam time zone (GMT+7)
    vietnam_timezone = timezone(timedelta(hours=7))
    now_vietnam = now_utc.astimezone(vietnam_timezone)

    # format time
    formatted_time = now_vietnam.strftime("%Y-%m-%dT%H:%M:%SZ")
    return formatted_time


def transPdfToText(file):
    # read file
    pdf_reader = PdfReader(BytesIO(file.read()))

    content = ""
    # extract to text
    for page in pdf_reader.pages:
        content += page.extract_text()

    return content


def transDocToText(file):
    # read file
    doc_reader = Document(BytesIO(file.read()))

    content = ""
    # extract to text
    for paragraph in doc_reader.paragraphs:
        content += paragraph.text + "\n"

    return content


def transTxtToText(file):
    # read file
    content = file.read().decode("utf-8")

    return content