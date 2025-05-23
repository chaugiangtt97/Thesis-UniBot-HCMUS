import json

from flask import Blueprint, request, jsonify  # type: ignore
from flask_cors import cross_origin  # type: ignore

from werkzeug.utils import secure_filename  # type: ignore

from middlewares.handleError import handleError

from controllers.file_controller import File_Controller as File

main = Blueprint("file", __name__)


@main.route("/", methods=["GET"])
@cross_origin()
def get_file():
    try:

        collection_name = request.args.get("collection_name")

        if not collection_name:
            raise ValueError("Missing required parameter 'collection_name'")

        # -------------------------------------------

        return File().get_file(collection_name)

    except ValueError as e:
        return handleError(400, str(e))
    except FileNotFoundError:
        return Exception(404, str(e))
    except Exception as e:
        return handleError(500, str(e))


@main.route("/insert", methods=["POST"])
@cross_origin()
def insert_file():
    try:
        # Validate and extract 'chunks'
        if "chunks" not in request.form:
            raise ValueError("Missing required parameter 'chunks'")
        try:
            chunks = json.loads(request.form["chunks"])
        except Exception:
            raise ValueError("Invalid JSON format for 'chunks'")

        # Validate and extract 'collection_name'
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

        # Validate and extract 'filename'
        filename = request.form.get("filename")
        if not filename:
            raise ValueError("Missing required parameter 'filename'")

        # Validate and extract 'metadata'
        if "metadata" not in request.form:
            raise ValueError("Missing required parameter 'metadata'")
        try:
            metadata = json.loads(request.form["metadata"])
        except Exception:
            raise ValueError("Invalid JSON format for 'metadata'")

        # -------------------------------------------
        return File().insert_file(filename, metadata, collection_name, chunks)

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        return handleError(500, str(e))


@main.route("/delete", methods=["POST"])
@cross_origin()
def delete_file():
    try:
        document_id = request.form.get("document_id")
        collection_name = request.form.get("collection_name")

        if not document_id:
            raise ValueError("Missing required parameter 'document_id'")
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
        return File().delete_file(document_id, collection_name)

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        return handleError(500, str(e))


@main.route("/chunk", methods=["POST"])
@cross_origin()
def chunk_file():
    try:

        text = request.form.get("text")
        if not text:
            raise ValueError("Missing required parameter 'text'")

        # -------------------------------------------
        return File().chunk_file(text)

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        raise handleError(500, str(e))


@main.route("/enhance", methods=["POST"])
@cross_origin()
def enhance_document():
    try:
        # Validate and extract 'article'
        article = request.form.get("article")
        if not article:
            raise ValueError("Missing required parameter 'article'")

        # Validate and extract 'collection_name'
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
        return File().enhance(collection_name, article)

    except ValueError as e:
        return handleError(400, str(e))
    except Exception as e:
        raise handleError(500, str(e))
