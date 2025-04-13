// store/reducers/authReducer.js
import { LOGIN, LOGOUT, REFRESH } from "../actions/authActions";

const initialState = {
  loggedIn: false,
  user: null,
  token: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggedIn: true,
        ...action.payload,
      };
    case REFRESH: 
      return {
        ...state,
        loggedIn: true,
        ...action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        user: null,
        token: null
      };
    default:
      return state;
  }
};

export default authReducer;
