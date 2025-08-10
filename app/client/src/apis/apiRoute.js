const server_dir = import.meta.env?.VITE_SERVER ? ('/' + import.meta.env?.VITE_SERVER) : ''
const subdir = import.meta.env?.VITE_SUBDIR ? ('/' + import.meta.env?.VITE_SUBDIR) : ''

export const server_domain = `${subdir}${server_dir}`

import { getRequest } from "./request/get"
import { postRequest } from "./request/post"
import { putRequest } from "./request/put"
import { deleteRequest } from "./request/delete"

const authRequest = '/auth'
const configRequest = '/config'
const chatSessionRequest = '/chat-session'
const chatCollectionRequest = '/chat-collection'
const schemaCollectionRequest = '/chat-collection/schema'
const profileRequest = '/user/profile'
const userRequest = '/user/'
const documentRequest = '/document/'

export const useApi = {
  // -----------------------------------------------------------------------
  // --------------------- Auth Request ------------------------------------
  // -----------------------------------------------------------------------

  login: async (email = null, password = null, captchaToken = null) =>
    await postRequest(server_domain + authRequest, `/login`, { email, password, captchaToken }),

  register: (email = null, password = null, name = null, educationRole = null,
    academicInformation = null, captchaToken = null) =>
    postRequest(server_domain + authRequest, `/register`,
      { email, password, name, educationRole, academicInformation, captchaToken }),

  login_by_token: (token) => postRequest(server_domain + authRequest, `/login-by-token`, { token: token }, token),

  email_verify: (email = null, verificationCode = null) =>
    postRequest(server_domain + authRequest, `/email/verify`, { email, verificationCode }),

  email_request_verification:
    (email = null, code = 'FORGOT_PASSWORD', captchaToken = null) =>
      postRequest(server_domain + authRequest, `/email/request-verification`,
        { email, code, captchaToken }),

  // -------------------------------------------------------------------------
  // --------------------- Params Request ------------------------------------
  // -------------------------------------------------------------------------

  getParams: (token) =>
    getRequest(server_domain + authRequest, `/admin/config/params`, token),

  postParams: (token, use_history = null, max_tokens = null, filter_bias = null,
    threshold = null, k = null) =>
    postRequest(server_domain + authRequest, `/admin/config/params`,
      { use_history, max_tokens, filter_bias, threshold, k }, token),


  // -------------------------------------------------------------------------
  // --------------------- Config Request ------------------------------------
  // -------------------------------------------------------------------------

  get_captcha_token: () =>
    getRequest(server_domain + configRequest, `/captcha`, null, null),

  get_collections: () =>
    getRequest(server_domain + configRequest, `/collections`, null, null),

  // -------------------------------------------------------------------------
  // --------------------- Chat Session Request ------------------------------
  // -------------------------------------------------------------------------

  get_chat_session: (token) =>
    getRequest(server_domain + chatSessionRequest, `/`, null, token),

  update_chat_session: (token, chat_session_id = null, dataUpdate = null) =>
    putRequest(server_domain + chatSessionRequest, `/`, { chat_session_id, dataUpdate }, token),

  create_chat_session: (token, chat_session_name = null, chat_session_description = null) =>
    postRequest(server_domain + chatSessionRequest, `/`, { chat_session_name, chat_session_description }, token),

  delete_chat_session: (token, chat_session_id) =>
    deleteRequest(server_domain + chatSessionRequest, `/`, { chat_session_id }, token),

  // -------------------------------------------------------------------------
  // --------------------- History Request -----------------------------------
  // -------------------------------------------------------------------------

  get_history_in_chat_session: (token, chat_session_id = null, history_id = null) =>
    getRequest(server_domain + chatSessionRequest, `/history`, { chat_session_id, history_id }, token),

  update_history_in_chat_session: (token, history_id = null, dataUpdate = null) =>
    putRequest(server_domain + chatSessionRequest, `/history`, { history_id, dataUpdate }, token),

  create_history_in_chat_session: (token, new_conservation = {}) =>
    postRequest(server_domain + chatSessionRequest, `/history`, { new_conservation }, token),

  delete_history_in_chat_session: (token, history_id = null) =>
    deleteRequest(server_domain + chatSessionRequest, `/history`, { history_id }, token),

  get_recommended_questions_from_db: (token) =>
    getRequest(server_domain + chatSessionRequest, `/recommended-questions`, null, token),

  // -------------------------------------------------------------------------
  // --------------------- Profile Request -----------------------------------
  // -------------------------------------------------------------------------

  get_profile: (token) =>
    getRequest(server_domain + profileRequest, `/`, null, token),

  update_profile: (token, dataUpdate = null) =>
    putRequest(server_domain + profileRequest, `/`, { dataUpdate }, token),

  // -------------------------------------------------------------------------
  // --------------------- User Request --------------------------------------
  // -------------------------------------------------------------------------

  reset_password: (token, password = null, newPassword = null) =>
    postRequest(server_domain + userRequest, `/reset-password`, { password, newPassword }, token),

  forgot_password: (email = null, verificationCode = null, newPassword = null) =>
    postRequest(server_domain + userRequest, `/forgot-password`, { email, verificationCode, newPassword }),

  // -------------------------------------------------------------------------
  // --------------------- Chat Collection Request ---------------------------
  // -------------------------------------------------------------------------

  get_chat_collection: (token) =>
    getRequest(server_domain + chatCollectionRequest, `/`, null, token),

  create_chat_collection: (token, long_name = null, description = null, metadata = {}) =>
    postRequest(server_domain + chatCollectionRequest, `/`, { long_name, description, metadata }, token),

  delete_chat_collection: (token, collection_name = null) =>
    deleteRequest(server_domain + chatCollectionRequest, `/`, { collection_name }, token),

  get_collection_schema: (token, chat_collection_name = null) =>
    getRequest(server_domain + chatCollectionRequest, `/schema`, { chat_collection_name }, token),

  // -------------------------------------------------------------------------
  // --------------------- Document Request ---------------------------
  // -------------------------------------------------------------------------

  get_document_in_collection: (token, collection_name) =>
    getRequest(server_domain + documentRequest, `/`, { collection_name }, token),


  upload_file: (token, formData) =>
    postRequest(server_domain + documentRequest, `/upload`, formData, token),

}

