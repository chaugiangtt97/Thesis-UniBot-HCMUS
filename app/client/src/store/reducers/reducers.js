import { INITIALSTATE, CAPTCHA_TOKEN, LIST_DOCUMENT, LIST_COLLECTION } from "../actions/actions";

const initialState = {
  payload: null,
  list_collections: null,
  list_documents: null,
  current_documents: null,   // document_name
  current_collection: null   // collection_name
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case INITIALSTATE:
      return {
        ...state,
        index: action.payload,
      };
    case CAPTCHA_TOKEN:
      return {
        ...state,
        captchaToken: action.payload,
      };
    case LIST_COLLECTION:
      return {
        ...state,
        list_collections: action.payload,
      };
    case LIST_DOCUMENT:
      return {
        ...state,
        list_documents: {
          ...state.list_documents,
          [action.payload.collection_name]: action.payload.document_data
        }

      };
    default:
      return state;
  }
};

export default reducers;
