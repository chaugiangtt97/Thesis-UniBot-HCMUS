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
    df = df[~df['article'].isna()]
    #chunk id to integer
    df['chunk_id'] = df['chunk_id'].astype(int)
    #location to integer
    #df['location'] = df['location'].astype(int)
    df['in_effect'] = "" #Legacy field, not used anymore
    #in_effect to str type
    # df['in_effect'] = df['in_effect'].astype(str)
    # Dummy updated at
    df['updated_at'] = df['created_at']
    #Rename columns
    # df.rename(columns={'article': 'article_FULL', 'chunks': 'article'}, inplace=True)
    # df = df.loc[:, df.columns != 'article_FULL']
    return df

def convert_type_string_to_datatype(type_string):
    """
    Convert a string representation of a data type to the corresponding Milvus DataType enum.
    
    Args:
        type_string (str): String representation of the data type
        
    Returns:
        DataType: Corresponding Milvus DataType enum value
        
    Raises:
        ValueError: If the type string is not recognized
    """
    type_mapping = {
        # Integer types
        "INT8": DataType.INT8,
        "INT16": DataType.INT16,
        "INT32": DataType.INT32,
        "INT64": DataType.INT64,
        "int8": DataType.INT8,
        "int16": DataType.INT16,
        "int32": DataType.INT32,
        "int64": DataType.INT64,
        "int": DataType.INT64,  # Default to INT64 for 'int'
        
        # Float types
        "FLOAT": DataType.FLOAT,
        "DOUBLE": DataType.FLOAT,
        "float": DataType.FLOAT,
        "double": DataType.FLOAT,
        
        # Boolean type
        "BOOL": DataType.BOOL,
        "bool": DataType.BOOL,
        "boolean": DataType.BOOL,
        
        # String types
        "VARCHAR": DataType.VARCHAR,
        "STRING": DataType.VARCHAR,
        "varchar": DataType.VARCHAR,
        "string": DataType.VARCHAR,
        "str": DataType.VARCHAR,
        
        # Vector types
        "FLOAT_VECTOR": DataType.FLOAT_VECTOR,
        "BINARY_VECTOR": DataType.BINARY_VECTOR,
        "float_vector": DataType.FLOAT_VECTOR,
        "binary_vector": DataType.BINARY_VECTOR,
        
        # JSON type (if supported)
        "JSON": DataType.JSON,
        "json": DataType.JSON,
    }
    
    # Normalize the input string
    normalized_type = type_string.strip()
    
    if normalized_type in type_mapping:
        return type_mapping[normalized_type]
    else:
        # Provide helpful error message with available types
        available_types = list(type_mapping.keys())
        raise ValueError(f"Unsupported data type: '{type_string}'. Available types: {available_types}")

def ingest_pipeline(data_path, collection_path):
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
    existing_collections = []
    #Collections ingestion
    with open(collection_path, 'r') as rstream:
        collection_data = json.load(rstream)

    collection_names = list(collection_data.keys())
    for col in collection_names:
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True), # Primary key
            FieldSchema(name="document_id", dtype=DataType.VARCHAR, max_length=50),
            FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=750,),
            FieldSchema(name="article", dtype=DataType.VARCHAR, max_length=4000,),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=3072,), #1024
            FieldSchema(name="chunk_id", dtype=DataType.INT32),
            FieldSchema(name="in_effect", dtype=DataType.VARCHAR, max_length=100,),
            FieldSchema(name="created_at", dtype=DataType.VARCHAR, max_length=50,),
            FieldSchema(name="created_at_unix", dtype=DataType.INT64, nullable=True),
            FieldSchema(name="updated_at", dtype=DataType.VARCHAR, max_length=50,),
            FieldSchema(name="url", dtype=DataType.VARCHAR, max_length=300),
            FieldSchema(name="is_active", dtype=DataType.BOOL),
        ]
        for field in collection_data[col]['fields']:
            field["dtype"] = convert_type_string_to_datatype(field["dtype"])
            field_schema = FieldSchema(**field)
            fields.append(field_schema)
        schema = CollectionSchema(fields, description=collection_data[col]['description'])
        
        if handler.has_collection(col):
            collection = Collection(col)
            existing_collections.append(col)
        else:
            collection = Collection(col, schema)
            index_params = {
                'metric_type':'L2',
                'index_type':"IVF_FLAT",
                'params':{"nlist":2048}
            }
            collection.create_index(field_name='embedding', index_params=index_params)
    
    #Inserting

    df = read_news_csv(data_path)
    #df = read_news_csv('./data/FIT_news_combined.csv')
    for col in df['collection'].unique():
        if col in existing_collections: #Check if collection already exists
            continue
        data = df[df['collection'] == col].loc[:, df.columns != 'collection'].dropna(axis=1, how='all') #Get by type, remove columns with all NaN
        data = data.to_dict('records')
        for d in data:
            d['embedding'] = ast.literal_eval(d['embedding']) #Revert string representation to float array
            #d['embedding'] = ast.literal_eval(d['embedding_OpenAI'])
            #d.pop('embedding_OpenAI')
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

data_path = sys.argv[1]
collection_path = sys.argv[2]

ingest_pipeline(data_path, collection_path)

print('Chạy xong!')
