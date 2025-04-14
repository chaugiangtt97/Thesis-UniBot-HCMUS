// store/actions/authActions.js

import { disconnectSocket } from "~/socket";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REFRESH = "REFRESH"

export const login = (session) => {
  localStorage.setItem('token', session.token);
  return {
    type: LOGIN,
    payload: session,
  };
};

export const refresh = (token, user) => {
  return {
    type: REFRESH,
    payload: {
      token, user
    },
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  disconnectSocket()
  return {
    type: LOGOUT,
  };
};
