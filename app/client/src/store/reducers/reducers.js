import { INITIALSTATE, CAPTCHA_TOKEN } from "../actions/actions";

const initialState = {
  payload: null,
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
    default:
      return state;
  }
};

export default reducers;
