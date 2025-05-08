collection_descriptions = {
    'student_handbook': "",
    'recruitment': "Những thông báo tuyển dụng và thực tập cho sinh viên khoa Công nghệ thông tin. Một số chương trình đòi hỏi kĩ năng khác nhau. Một số chỉ tuyển sinh viên năm 3 hoặc năm 4.",
    'academic_affairs': "Các thông báo của giáo vụ như lịch bảo vệ khóa luận tốt nghiệp, thông báo bảo hiểm y tế,... Thông báo thường được chỉ định là cho chương trình đào tạo nào, khóa và năm học.",
    'events': "Những thông báo về những hoạt động, sự kiện xảy ra. Thông báo sự kiện thường có địa chỉ tổ chức, ngày giờ và cách tham gia.",
    'scholarship': "Thông tin về học bổng, cách thức nộp hồ sơ, yêu cầu và thời hạn nộp hồ sơ. Những yêu cầu của học bổng thường là năm học, điểm trung bình tối thiểu, hoàn cảnh gia đình,...",
    'timetable': "Thông báo thay đổi phòng học, phòng thi, thời khóa biểu năm học, lịch thi.",
}

from pymilvus import(
    IndexType,
    Status,
    connections,
    FieldSchema,
    DataType,
    Collection,
    CollectionSchema
)
import json
import pandas as pd
import ast

def read_news_csv(path):
    df = pd.read_csv(path)

    #remove null
    df = df[~df['chunks'].isna()]
    #chunk id to integer
    df['chunk_id'] = df['chunk_id'].astype(int)
    #location to integer
    #df['location'] = df['location'].astype(int)
    #in_effect to str type
    df['in_effect'] = df['in_effect'].astype(str)
    # Dummy updated at
    df['updated_at'] = df['created_at']
    #Rename columns
    df.rename(columns={'article': 'article_FULL', 'chunks': 'article'}, inplace=True)
    df = df.loc[:, df.columns != 'article_FULL']
    return df

def ingest_pipeline(student_path, news_path):
    ## Techzone's Standalone Milvus instance
    # host = '161.156.196.183'
    # port = '8080'
    # password = '4XYg2XK6sMU4UuBEjHq4EhYE8mSFO3Qq'
    # user = 'root'
    # server_pem_path =  './data/cert.pem'
    # server_name = 'localhost'
    ## Techzone's watsonx.data Milvus service
    # host = 'useast.services.cloud.techzone.ibm.com'
    # # host = 'jp-tok.services.cloud.techzone.ibm.com'
    # port = '36196'
    # password = 'password'
    # user = 'ibmlhadmin'
    # server_pem_path = './data/milvus_cert.pem'
    # server_name = 'watsonxdata'
    host = 'standalone'
    port = '19530'
    #Prod Server (e5-large embeds)
    # uri = 'https://in05-89bc8f2593a1710.serverless.gcp-us-west1.cloud.zilliz.com'
    # token = "c8e544eef2382fdc48c3829f3fb94a8d09451ed84a6183774894e097ab0da83356204032bad89fc68271027bec24806c1c52e0d6"
    #uri = "https://in01-4c6a7381b7913fa.gcp-asia-southeast1.vectordb.zillizcloud.com:443"
    #token = "db_admin:Jn1<BnK>]sj8V8&N"
    #Experimental Server (OpenAI Embeds)
    # uri = 'https://in05-bfb1fbc5a8d82f9.serverless.gcp-us-west1.cloud.zilliz.com'
    # token = 'ed5dd7599d02904ce373bae55db5645a041435621e1c14a0ffcd81275b5f6d349b1e5d24b3766d140943399440f347783bdb5c0d'

    # connections.connect(alias = 'default',
    #                 host = host,
    #                 port = port,
    #                 user = user,
    #                 password = password,
    #                 server_pem_path=server_pem_path,
    #                 server_name = server_name,
    #                 secure = True)
    connections.connect(alias = 'default',
                        host = host,
                        port=port
    )
    # connections.connect(alias='default', uri=uri, token=token)
    handler = connections._fetch_handler('default')
    # News Collections ingestion
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True), # Primary key
        FieldSchema(name="document_id", dtype=DataType.VARCHAR, max_length=50),
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=750,),
        FieldSchema(name="article", dtype=DataType.VARCHAR, max_length=3500,),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=3072,), #1024
        FieldSchema(name="chunk_id", dtype=DataType.INT32),
        FieldSchema(name="school_year", dtype=DataType.INT32),
        FieldSchema(name="in_effect", dtype=DataType.VARCHAR, max_length=100,),
        FieldSchema(name="file_links", dtype=DataType.VARCHAR, max_length=750),
        FieldSchema(name="created_at", dtype=DataType.VARCHAR, max_length=50,),
        FieldSchema(name="created_at_unix", dtype=DataType.INT64,),
        FieldSchema(name="updated_at", dtype=DataType.VARCHAR, max_length=50,),
        FieldSchema(name="url", dtype=DataType.VARCHAR, max_length=300),
        FieldSchema(name="is_active", dtype=DataType.BOOL),
    ]
    collection_names = ['recruitment', 'timetable', 'scholarship', 'academic_affairs', 'events']
    for col in collection_names:
        schema = CollectionSchema(fields, description=collection_descriptions[col])
        if col in ['recruitment', 'scholarship']:
            schema.add_field("keywords", datatype=DataType.ARRAY, element_type=DataType.VARCHAR,max_length=100, max_capacity=8,
                             description="IT technological skills related to the article. Output in a list of strings."
                             )
            schema.add_field("majors", datatype=DataType.ARRAY, element_type=DataType.VARCHAR,max_length=100, max_capacity=8,
                             description="""Majors mentioned in the article. Valid majors are 'công nghệ phần mềm','khoa học dữ liệu','khoa học máy tính','hệ thống thông tin','kỹ thuật phần mềm','công nghệ thông tin','mạng máy tính','thị giác máy tính','công nghệ tri thức'. Output in a list of strings."""
                             )
        elif col == 'events':
            schema.add_field("location", datatype=DataType.INT16,
                             description="""Location of the event. Valid values are 0,1,2.
The school has two locations, with a few details about each location provided below:
Location 1: Cơ sở 1 - Cơ sở quận 5 - 227 Nguyễn Văn Cừ, Phường 4, Quận 5.
Location 2: Cơ sở 2 - Cơ sở Thủ Đức/Linh Trung - Làng Đại học, Phường Linh Trung, Thành phố Thủ Đức.
If no location of the two provided or both locations is mentioned, return 0. Note that the location may not be explicitly mentioned in full in the article."""
                             )
        elif col == 'timetable':
            schema.add_field("subjects_name", datatype=DataType.ARRAY, element_type=DataType.VARCHAR, max_length=100, max_capacity=8,
                             description="""Name of the subjects mentioned in the article. Output in a list of strings. If none is found, output an empty list.
Some examples of subjects are 'Cấu trúc dữ liệu và giải thuật','Lập trình hướng đối tượng','Cơ sở dữ liệu','Toán rời rạc','Lập trình web','Hệ điều hành','Mạng máy tính'.
Note that values may not be explicitly mentioned, but derived or written in acronyms."""
                             )
            schema.add_field("subjects_code", datatype=DataType.ARRAY, element_type=DataType.VARCHAR, max_length=100, max_capacity=8,
                             description=""
                             )
        if handler.has_collection(col):
            collection = Collection(col)
        else:
            collection = Collection(col, schema)
            index_params = {
                'metric_type':'L2',
                'index_type':"IVF_FLAT",
                'params':{"nlist":2048}
            }
            collection.create_index(field_name='embedding', index_params=index_params)
    # Student handbook collection
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True), # Primary key
        FieldSchema(name="document_id", dtype=DataType.VARCHAR, max_length=50),
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=300,),
        FieldSchema(name="article", dtype=DataType.VARCHAR, max_length=5000,),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=3072,), #1024
        FieldSchema(name="page_number", dtype=DataType.INT32),
        FieldSchema(name="school_year", dtype=DataType.INT32,),
        FieldSchema(name="in_effect", dtype=DataType.VARCHAR, max_length=100,),
        FieldSchema(name="created_at", dtype=DataType.VARCHAR, max_length=200,),
        FieldSchema(name="updated_at", dtype=DataType.VARCHAR, max_length=200,),
        FieldSchema(name="is_active", dtype=DataType.BOOL),
        FieldSchema(name="url", dtype=DataType.VARCHAR, max_length=300),
    ]
    schema = CollectionSchema(fields, "student handbook schema")
    if handler.has_collection('student_handbook'):
        collection = Collection('student_handbook')
    else:
        collection = Collection('student_handbook', schema)
        index_params = {
            'metric_type':'L2',
            'index_type':"IVF_FLAT",
            'params':{"nlist":2048}
        }
        collection.create_index(field_name='embedding', index_params=index_params)
    #Inserting
    collection = Collection('student_handbook')
    path = './data/student_handbook_embedded.json'
    #path = './data/student_handbook_embedded_OpenAI.json'
    with open(student_path, 'r') as rstream:
        data = json.load(rstream)
        for d in data:
            d['in_effect'] = str(d['in_effect'])
            d['is_active'] = True
        collection.insert(data)

    df = read_news_csv(news_path)
    #df = read_news_csv('./data/FIT_news_combined.csv')
    for col in df['type'].unique():
        data = df[df['type'] == col].loc[:, df.columns != 'type'].dropna(axis=1, how='all') #Get by type, remove columns with all NaN
        data = data.to_dict('records')
        for d in data:
            # d['embedding'] = ast.literal_eval(d['embedding']) #Revert string representation to float array
            d['embedding'] = ast.literal_eval(d['embedding_OpenAI'])
            d.pop('embedding_OpenAI')
            if col == "events":
                d['location'] = int(d['location'])
            elif col in ['recruitment', 'scholarship']:
                d['keywords'] = ast.literal_eval(d['keywords'])
                d['majors'] = ast.literal_eval(d['majors'])
            elif col == 'timetable':
                d['subjects_name'] = ast.literal_eval(d['subjects_name'])
                d['subjects_code'] = ast.literal_eval(d['subjects_code'])

        collection = Collection(col)
        collection.insert(data)

# ingest_pipeline()

import sys

student_handbook_path = sys.argv[1]
fit_news_path = sys.argv[2]

ingest_pipeline(student_handbook_path, fit_news_path)
