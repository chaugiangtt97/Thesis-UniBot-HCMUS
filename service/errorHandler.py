from flask import jsonify

class ElasticsearchError(Exception):
    pass

class InvalidDataError(Exception):
    pass

class ErrorHandler:
    @staticmethod
    def elasticsearch_error(error):
        raise ElasticsearchError("Error Elasticsearch: " + str(error))

    @staticmethod
    def invalid_data(error):
        raise InvalidDataError("Invalid Data:" + str(error))
