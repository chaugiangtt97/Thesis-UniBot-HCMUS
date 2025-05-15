import os

        
def buildErrorObject(message, details=None):
    """
    Build and return an error object.

    :param code: Error code (int or string).
    :param message: Error message (string).
    :param details: Additional details about the error (optional).
    :return: Dictionary representation of the error object.
    """
    
    print(f"Error: {message} - {details}")
        
    return {
        "message": message,
        "details": details
    }
