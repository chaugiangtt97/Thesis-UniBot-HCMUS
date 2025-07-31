from flask_cors import cross_origin # type: ignore
from flask import (               # type: ignore
  Blueprint, request, jsonify, 
  Response, stream_with_context )

import json

from controllers.generate_controller import Generate_Controller as Generate
from middlewares.handleError import handleError

main = Blueprint("generate", __name__)


""" Handles the determine collection route """
@main.route("/determine_collection", methods=["POST"])
@cross_origin()
def determine_collection_route():
    try:        
        query = request.form.get('query')
        if not query:
            return handleError(400, "Missing required parameter 'query'")
        history_raw = request.form.get('history', '[]')
        
        try:
            history = json.loads(history_raw)
            if not isinstance(history, list):
                raise ValueError("History must be a JSON array")
        except json.JSONDecodeError:
            return handleError(400, "Invalid JSON format for 'history'")
        except ValueError as ve:
            return handleError(400, str(ve))
            
      #-------------------------------------------
        return Generate() .determine_collection(query, history)
    
    except Exception as e: 
        return handleError(500, str(e))


""" Handles the metadata extraction route """
@main.route("/extract_meta", methods=['POST'])
@cross_origin()
def extract_metadata_route():
    try:
        query = request.form.get('query')
        if not query:
            return handleError(400, "Missing required parameter 'query'")

        chosen_collection = request.form.get('chosen_collection')
        if not chosen_collection:
            return handleError(400, "Missing required parameter 'chosen_collection'")
        if chosen_collection not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment', 'Chapter_0_and_1', 'Chapter_2', 'Chapter_3']: #LEGACY
            chosen_collection = f"_{chosen_collection}"

        history_raw = request.form.get('history', '[]')
        try:
            history = json.loads(history_raw)
            if not isinstance(history, list):
                raise ValueError("History must be a JSON array")
        except (json.JSONDecodeError, ValueError) as e:
            return handleError(400, str(e))

      #-------------------------------------------
        return Generate().extract_metadata(query, chosen_collection, history) # return filter_expressions

    except Exception as e:
        return handleError(500, str(e))  


""" Handles the search route """
@main.route("/search", methods=["POST"])
@cross_origin()
def search_route():
    try:
        query = request.form.get('query')
        if not query:
            return handleError(400, "Missing required parameter 'query'")

        chosen_collection = request.form.get('chosen_collection')
        if not chosen_collection:
            return handleError(400, "Missing required parameter 'chosen_collection'")
        if chosen_collection not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
            chosen_collection = f"_{chosen_collection}"

        filter_expressions_raw = request.form.get('filter_expressions', None)
        filter_expressions = None
        if filter_expressions_raw:
            try:
                filter_expressions = json.loads(filter_expressions_raw)
            except json.JSONDecodeError:
                return handleError(400, "Invalid JSON format for 'filter_expressions'")

      #-------------------------------------------
        return Generate().search(query, chosen_collection, filter_expressions) # context, source

    except Exception as e:
        return handleError(500, str(e))


""" Handles the generate route """
@main.route("/", methods=["POST"])
@cross_origin()
def generate_route():
    try:
        query = request.form.get('query')
        if not query:
            return handleError(400, "Missing required parameter 'query'")

        context = request.form.get('context', '') 

        streaming = request.form.get('streaming', False)
        if streaming and streaming != False: 
            streaming = streaming.lower() == 'true'
        
        history_raw = request.form.get('history', '[]')
        try:
            history = json.loads(history_raw)
            if not isinstance(history, list):
                raise ValueError("History must be a JSON array")
        except (json.JSONDecodeError, ValueError) as e:
            return handleError(400, str(e))
        
        theme = request.form.get('collection_name', '')     # Collection name
        user_profile = request.form.get('user_profile', '') # User profile
      
      #-------------------------------------------
        answer = Generate().generate(query, context, streaming, theme, user_profile, history)
        print(answer,query, streaming)
        if answer and streaming:
          def generate_stream():
            for part in answer:
              yield part            # Yield từng phần của câu trả lời
          return Response(stream_with_context(generate_stream()), content_type='text/plain;charset=utf-8')
          
        return answer
    
    except Exception as e: 
        return handleError(500, e)
