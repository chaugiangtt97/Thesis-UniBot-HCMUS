import { INITIALSTATE } from "../actions/actions";
// import { navList_1, navList_2 } from "~/config/navList";
// import { subNav as knowledge_baseSubNavs } from "~/pages/Dashboard/KnowledgeBase/SubNav";
const initialState = {
  // dashboard: { ...navList_1, ...navList_2 },
  // subnav: {
  //   346: knowledge_baseSubNavs,
  // },
  payload: null,
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case INITIALSTATE:
      return {
        ...state,
        index: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
