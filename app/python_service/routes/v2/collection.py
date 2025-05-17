import json
from flask import Blueprint, request, jsonify   # type: ignore
from flask_cors import cross_origin             # type: ignore

from middlewares.handleError import handleError

from controllers.collection_controller import Collection_Controller

main = Blueprint("collection", __name__)

""" Handles get all the collection route """
@main.route("/", methods=["POST"])  # NOTE /get_file -> /
@cross_origin()
def create_collection():
  try:
    data = request.form

    # Validate required fields
    required_fields = ['name', 'long_name', 'description', 'metadata']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
      raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    name = data['name']
    long_name = data['long_name']
    description = data['description']

    # Validate and parse metadata
    try:
      metadata = json.loads(data['metadata'])
      if not isinstance(metadata, list):
        raise ValueError("Metadata must be a JSON array.")
    except json.JSONDecodeError:
      raise ValueError("Invalid JSON format for metadata.")
    
    #----------------------------------------
    return Collection_Controller().create_collection(name, long_name, description, metadata)
  
  except ValueError as e: 
      return handleError(400, str(e))
  except Exception as e: 
      return handleError(500, str(e))


@main.route("/", methods=["PATCH"])
def drop_collection():
  try:
    collection_name = request.form.get('collection_name')
    
    if not collection_name:
      raise ValueError("Missing required parameter 'collection_name'")
    
    if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
        collection_name = "_" + collection_name
    
    #-------------------------------------------
    return Collection_Controller().drop_collection(collection_name)

  except ValueError as e: 
      return handleError(400, str(e))
  except Exception as e:
    raise handleError(500, str(e))

@main.route("/schema", methods=["GET"])
@cross_origin()
def get_schema():
  try:
    collection_name = request.form.get('collection_name')
    
    if not collection_name:
      raise ValueError("Missing required parameter 'collection_name'")
    
    if collection_name not in ['events', 'academic_affairs', 'scholarship', 'timetable', 'recruitment']:
        collection_name = "_" + collection_name
    
    #-------------------------------------------
    return Collection_Controller().drop_collection(collection_name)
    
  except ValueError as e: 
      return handleError(400, str(e))
  except Exception as e:
    raise handleError(500, str(e))