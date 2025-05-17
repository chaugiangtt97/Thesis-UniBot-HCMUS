import json
import ast

from config.milvusdb import MilvusDB
    
def create_prompt_milvus(question, context, output_fields=['title','article']):
    full_context = """
    
    You always answer with markdown formatting using GitHub syntax. Do not use ordered or numbered lists.
    You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. 
    Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. 
    Respond in a brief and concise manner.

    Try to answer the user's question using the given context below. The context consists of groups of a question, its answer and the section it belongs to.
    Specify which questions and sections you derived your final answer from.

    Do not start with "based on" or "according to" in your response or anything similar, in your response. 
    Provide your answer only based on the provided information. If the answer is not in provided information, explain that you are only trained on the provided information.
    Always answer in Vietnamese.

    """
    full_context = ""
    for answer in context:
        context = ""
        if type(output_fields) is not list:
            context = output_fields + ":" + answer.get(output_fields)
        else:
            for field in output_fields:
                value = answer.get(field)
                context = context + field.title() + ": " + value + "\n" # 'question: How are you?'
        full_context = full_context + context + "\n"

    # complete_prompt = full_context + "\nUSER'S QUESTION: " + question
    complete_prompt = full_context
    return complete_prompt

def determine_collection(question, model, database_descriptions, collection_names):
    prompt = """Using the collections descriptions below and the user's question. 
    Determine which collections to search to find the documents most related to the question.
    Do not provide any explanations, only answer with the collection name.
    """
    full_prompt = prompt + '\n' + database_descriptions + '\n' + question + '\n'
    result = model.model.generate_text(full_prompt)
    result = result.strip()
    for collection in collection_names:
        idx = result.find(collection)
        if idx != -1:
            result = result[idx:idx + len(collection)]
    return result

def metadata_extraction(query, model, schema: list|dict):
    '''Extract metadata from user query given a schema using a LLM call
    schema: can be list (names of metadata attributes) or dict (name-description key-value pairs)'''

    prompt = prompt = """Extract metadata from the user's query using the provided schema.
Do not include the metadata if not found.
User's query: {query}
Schema:
{schema}
Always answer in JSON format.
Answer:
"""
    if type(schema) is list:
        schema = ",".join(schema)
    elif type(schema) is dict:
        schema = "\n".join(k + ": " + v for k,v in schema.items())
    else:
        raise TypeError("Schema should be list or dict, got " + str(type(schema)))
    
    full_prompt = prompt.format(query=query, schema=schema)
    result = model.model.generate_text(full_prompt)
    try:
        result = json.loads(result)
    except json.JSONDecodeError: #Wrong format
        print("Metadata Extraction: Couldn't decode JSON - " + result)
        result = -1
    return result

def compile_filter_expression(metadata, loaded_collections: list, persistent_collections: list = [], latest_timespan_months: int = 5):
  '''Read collections schemas to compile filtering expressions for Milvus'''
  try: 
    # Connect milvus if not connected - singleton object
    milvus = MilvusDB()  
    
    expressions = {}
    for c in loaded_collections:
        expressions[c] = ""
        short_schema = {}
        schema = milvus.Collection(c).describe()['fields']
        for s in schema:
            short_schema[s['name']] = s['type']
        is_latest = False
        for attr, val in metadata.items():
            if val is None or val == "" or val == []: #Skip empty values
                continue
            if attr == 'article': #Skip article TODO: FIX THIS FOR BETTER FLEXIBILITY
                continue
            if attr == 'latest' and val == True and c not in persistent_collections: #If the user wants the latest articles
                is_latest = True
                print("SEARCH: Latest articles required")
                continue
            meta_type = short_schema.get(attr, -1)
            if meta_type == -1:
                continue

            if short_schema[attr] == milvus.DataType.INT8 or short_schema[attr] == milvus.DataType.INT16 or short_schema[attr] == milvus.DataType.INT32 or short_schema[attr] == milvus.DataType.INT64 or short_schema[attr] == milvus.DataType.FLOAT: #intege
                expressions[c] += attr + ' == ' + str(val) + " || "
            elif short_schema[attr] == milvus.DataType.VARCHAR:
                expressions[c] += attr + f' == "{val}"' + " || "
            elif short_schema[attr] == milvus.DataType.ARRAY:
                try:
                    if type(ast.literal_eval(val)) is list:
                        expressions[c] += f"array_contains_any({attr}, {ast.literal_eval(val)}) || "
                    else:
                        expressions[c] += f"array_contains_any({attr}, {val}) || "
                except ValueError:
                    expressions[c] += f"array_contains_any({attr}, {val}) || "
        if is_latest: #Filter expression requires latest articles
            expressions[c] = expressions[c].removesuffix(' || ')
            import datetime
            # Get the current date and time
            now = datetime.datetime.now()
            # Get the current timestamp in seconds since epoch minus 5 months
            current_timestamp = int(now.timestamp()) - latest_timespan_months * 30 * 24 * 60 * 60 #5 months in seconds
            # Add the timestamp to the filter expression
            if expressions[c] != "":
                expressions[c] = "(" + expressions[c] + ")" + " && " + "created_at_unix >= " + str(current_timestamp)
            else:
                expressions[c] = "created_at_unix >= " + str(current_timestamp)
        else:
            # Reformat
            expressions[c] = expressions[c].removesuffix(' || ')
    return expressions
  except Exception as e:
    raise e

#------------------------------------#
def metadata_extraction_v2(query, model, collection_name, database, pydantic_schema=None):
    '''Extract metadata from user query given a schema using a LLM call
    schema: can be list (names of metadata attributes) or dict (name-description key-value pairs)'''

    prompt = prompt = """Extract metadata from the user's query using the provided schema.
Do not include the metadata if not found.\
Always leave article attribute as empty.
User's query: {query}
Schema:
{schema}
Always answer as a JSON object.
Answer:
"""
    fields = database.get_collection_schema(collection_name, readable=False)
    
    schema = {}
    for field in fields:
        schema[field['name']] = field['description']
    schema = "\n".join(k + ": " + v for k,v in schema.items())
    schema += "latest: whether the user's question requires the latest articles.\n"

    full_prompt = prompt.format(query=query, schema=schema)
    if pydantic_schema is not None:
        result = model._generate(prompt=full_prompt, response_schema=pydantic_schema).model_dump_json()
    else:
        result = model._generate(full_prompt)
    result = result.replace('"', '\"') #Escape quotes
    try:
        result = json.loads(result)
        for k, v in result.items():
            if type(v) is str:
                result[k] = v.lower()
            elif type(v) is list:
                result[k] = [x.lower() for x in v]
    except json.JSONDecodeError: #Wrong format
        try:
            result = result.replace("`", '').replace("json", '')
            result = json.loads(result)
            for k, v in result.items():
                if type(v) is str:
                    result[k] = v.lower()
                elif type(v) is list:
                    result[k] = [x.lower() for x in v]
        except json.JSONDecodeError:
            print("Metadata Extraction: Couldn't decode JSON - " + result)
            result = -1
    return result

def rewrite_query(conversation, model, k=2):
    '''Rewrite the user's query using the context of the conversation'''
    prompt = """Summarize the user's conversation into a query to be used as a search query.
User's conversation:
\\
{conversation}
\\
Note that the user can change the topic in the middle of the conversation, only consider the newest topic.
Summarize in {k} different ways. Don't change the language of the query. (Mostly Vietnamese)
Use this JSON schema, answer with the JSON string representation ONLY:
Return: list[str]"""
    full_prompt = prompt.format(conversation=conversation, k=k)
    print("Rewriting Queries--------")
    print(full_prompt)
    print("-------END--------")
    try:
        response = model._generate(full_prompt)
        response = response.replace("`", '').replace("json", '')
        result = json.loads(response)
    except json.JSONDecodeError:
        print("Couldn't decode JSON - " + response)
        result = -1
    return result

def get_document(filename, collection_name):
  try:
    # Connect milvus if not connected - singleton object
    milvus = MilvusDB()
    
    '''Get metadata from a file'''
    results = {}
    collection = milvus.Collection(collection_name)
    collection.load()
    chunk_id_name = 'chunk_id' if collection_name != 'student_handbook' else 'page_number'
    search_results = collection.query(
        expr=f"document_id == '{filename}'",
        output_fields=['article', chunk_id_name],
    )
    for r in search_results:
        results[r[chunk_id_name]] = r['article']
      
    if len(results) == 0: #No matching documents
        raise FileNotFoundError("No matching documents")
      
    #Sort by distance and return only k results
    myKeys = list(results.keys())
    myKeys.sort()
    sorted_list = [results[i] for i in myKeys]
    return sorted_list
  
  except Exception as e:
    raise e

def enhance_document(article, collection_name, pydantic_schema, model):
  '''Enhance the user's document by rewriting and extracting metadata'''
  
  prompt = """From the provided article, rewrite it to clean any spelling mistakes, grammatical errors, and missing spaces.\
    Keep the original language of the article (Vietnamese).\
    Additionally, extract metadata from the article using the provided schema. Metadata fields that are lists can have a maximum of 5 elements.\
    If the metadata field does not exist in the article, do not include it in the response.
    Schema descriptions:
    {schema}
    Article (encased in backticks): 
    ```
    {article}
  ```"""
  
  try:
    # Connect milvus if not connected - singleton object
    milvus = MilvusDB()  
    
    fields = milvus.Collection(collection_name).describe()['fields']
    schema = {}
    for field in fields:
        schema[field['name']] = field['description']
    schema = "\n".join(k + ": " + v for k,v in schema.items())
    response = model._generate(prompt.format(article=article, schema=schema), response_schema=pydantic_schema)
    try:
        obj = json.loads(response.model_dump_json())
    except json.JSONDecodeError:
            print("Couldn't decode JSON - " + response.model_dump_json())
            obj = -1
    return obj
  
  except Exception as e:
    raise e
