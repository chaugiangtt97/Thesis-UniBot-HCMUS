from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from models.models import Model
import uuid

class LLM_Googles:  
    def __init__(self, api_key, manager_id):
        self.models = {}  # Từ điển lưu trữ các mô hình LLM
        self.id_counter = 0  # Bộ đếm tạo ID mô hình
        self.api_key = api_key
        self.manager_id = manager_id
        
    def generate_id():
        return str(uuid.uuid4())
    
    def get_model_info_from_api(self, model_id):
        return self.models[model_id]

    def _create_model(self, model_name, model_id = None) -> bool:
        # Tham số mẫu : https://api.python.langchain.com/en/latest/chat_models/langchain_google_genai.chat_models.ChatGoogleGenerativeAI.html      
        model = ChatGoogleGenerativeAI(
            google_api_key = self.api_key, 
            model= model_name,
            # max_output_tokens = 64,
            temperature = 0.7,
            top_k = None,
            top_p = None
        )
        try:
            model.invoke([HumanMessage(content="Hi! We are connected")])
        except Exception as e:
            raise ValueError(f"Model {model_id} not found : {e}")
        
        # Tạo ID mô hình mới và tạo thông tin
        if not model_id: 
            model_id =  str(uuid.uuid4())
        self.id_counter += 1


        # Lưu trữ mô hình và thông tin trong từ điển
        self.models[model_id] = Model(model, self.manager_id ,model_id,model_name ,"Google")
        return model_id

    def get_model(self, model_id):
        if model_id not in self.models:
            raise ValueError(f"Model with ID {model_id} not found")

        model_data = self.models[model_id]
        return model_data["model"]
    
    def create_new_model(self, model_name, model_id = None):
        # Tạo mô hình LLM mới và trả về ID mô hình
        # TODO kiểm tra điều kiện gì gì đó trước khi tạo. 
        model_id = self._create_model( model_name, model_id)
        return self.models[model_id]
   