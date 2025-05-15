from dao.mongo.api_service_repository import Api_Service_Repository


def get_llm_configs(code = 'ACTIVE'):
    """
    Retrieve LLM configurations based on the provided code.

    Args:
        code (str): The type of configurations to retrieve. 
                    - 'ALL': Retrieve all configurations.
                    - 'ACTIVE': Retrieve only active configurations.
                    - 'NOT_ACTIVE': Retrieve only inactive configurations.

    Returns:
        dict: A dictionary containing the requested configurations or an error object if the code is invalid.
    """
    ApiServiceConfigs = Api_Service_Repository()
    try:
        # Check if the code is valid
        if code.upper() not in ['ALL', 'ACTIVE', 'NOT_ACTIVE']:
            raise ValueError("Invalid code provided. Must be 'ALL', 'ACTIVE', or 'NOT_ACTIVE'.")
          
        if code.upper() == 'ALL':
            configs = ApiServiceConfigs.get_llm_configs()
        elif code.upper() == 'ACTIVE':
            configs = ApiServiceConfigs.get_llm_configs_active()
        elif code.upper() == 'NOT_ACTIVE':
            configs = ApiServiceConfigs.get_llm_configs_not_active()
            
    except ValueError as e:
        raise ValueError(str(e))
      
    except Exception as e:
        raise Exception(str(e))

    return configs