"""
This file contains the configuration for establishing a connection to a MongoDB database.

It includes the necessary settings and parameters required to connect to the MongoDB server,
such as the host, port, authentication credentials, and database name.

Ensure that the configuration values are properly set before using this file to establish
a connection to the database.
"""


from pymongo import MongoClient

def get_db():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['testdb']
    return db