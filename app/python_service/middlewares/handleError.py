from flask import jsonify # type: ignore

def handleError(code, error):
    """
    Handles error responses for the application.

    Args:
        error (Object): The error message to return.

    Returns:
        Response: A Flask JSON response with the error message and status code.
    """
    try:
        print(f"Error HTTP response: {code} - {error}")
        response = {
            "code": code,
            "msg": error
        }
        return jsonify(response), code
    except Exception as e: 
        return jsonify({}), 500 