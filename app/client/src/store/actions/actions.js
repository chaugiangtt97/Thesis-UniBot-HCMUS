export const INITIALSTATE = "INITIALSTATE";
export const CAPTCHA_TOKEN = "CAPTCHA_TOKEN";
export const LIST_COLLECTION = "LIST_COLLECTION";
export const LIST_DOCUMENT = "LIST_DOCUMENT";

export const navigate = (initialState) => {
  return {
    payload: initialState,
  };
};

export const captcha_token = (initialState) => {
  return {
    type: CAPTCHA_TOKEN,
    payload: initialState,
  };
};

export const list_collections_action = (initialState) => {
  return {
    type: LIST_COLLECTION,
    payload: initialState,
  };
};

export const list_documents_action = (collection_name, document_data) => {
  return {
    type: LIST_DOCUMENT,
    payload: {
      collection_name,
      document_data
    },
  };
};