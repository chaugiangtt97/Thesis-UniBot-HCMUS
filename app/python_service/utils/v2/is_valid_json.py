import json


def is_valid_json_string(s):
    try:
        json.loads(s)
        return True
    except (ValueError, TypeError):
        return False
