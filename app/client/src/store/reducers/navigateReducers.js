import { NAVIGATE } from "../actions/navigateActions";

const initialState = {
  dashboard: {
    index: null,
  }
};

const navigate = (state = initialState, action) => {
  switch (action.type) {
    case NAVIGATE:
      return {
        ...state,
        dashboard: action.payload,
      };
    default:
      return state;
  }
};

export default navigate;
