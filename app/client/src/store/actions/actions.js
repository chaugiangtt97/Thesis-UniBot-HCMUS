export const INITIALSTATE = "INITIALSTATE";
export const CAPTCHA_TOKEN = "CAPTCHA_TOKEN";

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