import json
from flask import Blueprint, request, jsonify  # type: ignore
from flask_cors import cross_origin  # type: ignore

from middlewares.handleError import handleError

from controllers.collection_controller import Collection_Controller

from utils.v2.is_valid_json import is_valid_json_string

main = Blueprint("collection", __name__)

""" Handles get all the collection route """


@main.route("/", methods=["POST"])
@cross_origin()
def create_collection():
    try:
        name = request.form.get("name")  # collection id
        if not name:
            raise ValueError("Missing required parameter 'name'")

        long_name = request.form.get("long_name")
        if not long_name:
            raise ValueError("Missing required parameter 'long_name'")

        description = request.form.get("description")
        if not description:
            raise ValueError("Missing required parameter 'description'")

        metadata = request.form.get("metadata")
        if not metadata:
            raise ValueError("Missing required parameter 'metadata'")

        # Validate and parse metadata
        try:
            if not is_valid_json_string(metadata):
                raise ValueError(
                    "Invalid JSON format for metadata. Metadata must be a JSON array."
                )
            metadata = json.loads(metadata)
        except json.JSONDecodeError:
            raise ValueError(
                "Invalid JSON format for metadata. Metadata must be a JSON array."
            )
        except Exception as e:
            raise
        # ----------------------------------------

        return Collection_Controller().create_collection(
            name, long_name, description, metadata
        )

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        return handleError(500, str(e))


@main.route("/", methods=["GET"])
@cross_origin()
def get_collection():
    try:
        collection_name = request.args.get("collection_name", None)  # collection name
        # ----------------------------------------
        return Collection_Controller().get_collection(collection_name)

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        return handleError(500, str(e))


@main.route("/", methods=["DELETE"])
def drop_collection():
    try:
        collection_name = request.form.get("collection_name")
        if not collection_name:
            raise ValueError("Missing required parameter 'collection_name'")

        # -------------------------------------------
        return Collection_Controller().drop_collection(collection_name)

    except ValueError as e:
        return handleError(400, str(e))
    except BaseException as e:
        return handleError(400, str(e))
    except Exception as e:
        raise handleError(500, str(e))


@main.route("/schema", methods=["GET"])
@cross_origin()
def get_schema():
    try:
        collection_name = request.form.get("collection_name")

        if not collection_name:
            raise ValueError("Missing required parameter 'collection_name'")

        if collection_name not in [
            "events",
            "academic_affairs",
            "scholarship",
            "timetable",
            "recruitment",
        ]:
            collection_name = "_" + collection_name

        # -------------------------------------------
        return Collection_Controller().get_schema(collection_name)

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        raise handleError(500, str(e))
