from config.mongodb import MONGODB

class Api_Service_Repository:
  def __init__(self):
    mongoObject = MONGODB()
    self.collection = mongoObject.get_handler()["api_configurations"]

  # ----------------------------------------
  # ----------------------------------------

  def get_llm_configs_active(self):
    try:
      result = self.collection.find_one(
        {"code": "LLM_APIs", "configs.isActive": True},
        {"configs.$": 1}  # Only retrieve the element where isActive=true in the array
      )
      if result:
        return result['configs'][0]
      raise ValueError("Không tồn tại cấu hình LLM_APIs")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn LLM active trong MongoDB", str(e))
  
  def get_llm_configs_not_active(self):
    try:
      result = self.collection.find_one(
        {"code": "LLM_APIs", "configs.isActive": False},
      )
      if result:
        return result['configs']
      raise ValueError("Không tồn tại cấu hình LLM_APIs")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn LLM not active trong MongoDB", str(e))
    
  def get_llm_configs(self):
    try:
      result = self.collection.find_one(
        {"code": "LLM_APIs"},
      )
      if result:
        return result['configs']
      raise ValueError("Không tồn tại cấu hình LLM_APIs")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn LLM trong MongoDB", str(e))
    
  # ----------------------------------------
  # ----------------------------------------
  
  def get_queryRouter_configs_active(self):
    try:
      result = self.collection.find_one(
        {"code": "QUERY_ROUTER", "configs.isActive": True},
        {"configs.$": 1}  # Only retrieve the element where isActive=true in the array
      )
      if result:
        return result['configs'][0]
      
      
      raise ValueError("Không tồn tại cấu hình QUERY_ROUTER active")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn Query Router active trong MongoDB", str(e))
  
  def get_queryRouter_configs_not_active(self):
    try:
      result = self.collection.find_one(
        {"code": "QUERY_ROUTER", "configs.isActive": False},
      )
      if result:
        return result['configs']
      raise ValueError("Không tồn tại cấu hình QUERY_ROUTER not active")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn Query Router not active trong MongoDB", str(e))
    
    
  def get_queryRouter_configs(self):
    try:
      result = self.collection.find_one(
        {"code": "QUERY_ROUTER"},
      )
      if result:
        return result['configs']
      raise ValueError("Không tồn tại cấu hình QUERY_ROUTER")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn Query Router trong MongoDB", str(e))
    
  # ----------------------------------------
  # ----------------------------------------
  
  def get_encoder_configs_active(self):
    try:
      result = self.collection.find_one(
        {"code": "ENCODER", "configs.isActive": True},
        {"configs.$": 1}  # Only retrieve the element where isActive=true in the array
      )
      if result:
        return result['configs'][0]
      raise ValueError("Không tồn tại cấu hình ENCODER")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn Encoder active trong MongoDB", str(e))
  
  def get_encoder_configs_not_active(self):
    try:
      result = self.collection.find_one(
        {"code": "ENCODER", "configs.isActive": False},
      )
      if result:
        return result['configs']
      raise ValueError("Không tồn tại cấu hình ENCODER")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn Encoder not active trong MongoDB", str(e))
    
    
  def get_encoder_configs(self):
    try:
      result = self.collection.find_one(
        {"code": "ENCODER"},
      )
      if result:
        return result['configs']

      raise ValueError("Không tồn tại cấu hình ENCODER")
      
    except Exception as e:
      raise Exception("Lỗi khi truy vấn Encoder trong MongoDB", str(e))
    
  # ----------------------------------------
  # ----------------------------------------
  