const domain = process.env.PYTHON_URI || 'http://localhost:5000'

export const python_domain = `${domain}`

import { getRequest } from './request/get'
import { postRequest } from './request/post'
// import { putRequest } from './request/put'
import { deleteRequest } from './request/delete'

const collectionRequest = '/collection'
const doucumentRequest = '/document'

export const useKHTN_Chatbot = {
  // -----------------------------------------------------------------------
  // --------------------- Collection Request ------------------------------
  // -----------------------------------------------------------------------

  get_collection_schema: async (collection_name = null) =>
    await getRequest(python_domain + collectionRequest, '/schema', { collection_name }),

  get_chat_collection: async (name_id = null) =>
    await getRequest(python_domain + collectionRequest, '/', { collection_name: name_id }),

  create_chat_collection: async (name = null, long_name = null, description = null, metadata = []) =>
    await postRequest(python_domain + collectionRequest, '/', { name, long_name, description, metadata }),

  delete_chat_collection: async (collection_name = null) =>
    await deleteRequest(python_domain + collectionRequest, '/', { collection_name }),

  get_chat_collection_schema: async (collection_name = null) =>
    await getRequest(python_domain + collectionRequest, '/schema', { collection_name }),


  // -----------------------------------------------------------------------
  // ----------------------- Ducument Request ------------------------------
  // -----------------------------------------------------------------------

  get_documents_in_collection: async (collection_name = null) =>
    await getRequest(python_domain + doucumentRequest, '/', { collection_name }),


  chunk_file: async (text = null) =>
    await postRequest(python_domain + doucumentRequest, '/chunk', { text })
}