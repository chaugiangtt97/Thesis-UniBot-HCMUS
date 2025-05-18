def buildSuccessObject( data = {}, message = "Operation successful" ):
    """
    Constructs a standardized success response object.

    Args:
        data (any, optional): The data to include in the response. Defaults to None.
        message (str, optional): A success message. Defaults to "Operation successful".

    Returns:
        dict: A dictionary representing the success response.
    """
    return {
        "code": 200,
        "message": message,
        "data": data
    }