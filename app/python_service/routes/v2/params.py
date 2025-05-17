from flask import Blueprint, request   # type: ignore
from flask_cors import cross_origin             # type: ignore

from controllers.param_controller import Params_Controller as Params

from middlewares.handleError import handleError

main = Blueprint("params", __name__)


@main.route("/", methods=["POST"])
@cross_origin()
def update_params():
  try:
    
    data = request.form
    
    required_fields =  ['k', 'filter_bias', 'threshold', 'use_history', 'max_tokens']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
      raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
  
    k = data['k']
    filter_bias = data['filter_bias']
    threshold = data['threshold']
    use_history = data['use_history']
    max_tokens = data['max_tokens']
    
    return Params().update(
      max_tokens = max_tokens, k = k,
      filter_bias = filter_bias,
      use_history = use_history,
      threshold = threshold
    )
  
  except Exception as e:
    return handleError(500, str(e))
  

@main.route("/", methods=["GET"])
@cross_origin()
def list_params():
  try:
    return Params().list()
  
  except Exception as e:
    return handleError(500, str(e))
