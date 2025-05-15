from flask import jsonify # type: ignore

def handleSuccess(data):
    """
    Handles success responses for the application.

    Args:
        data (Object): The success message to return.

    Returns:
        Response: A Flask JSON response with the success message and status code.
    """
    try:
        response = {
            "code": 200,
            "msg": data
        }
        return jsonify(response), 200
    except Exception as e: 
        return jsonify({}), 200 