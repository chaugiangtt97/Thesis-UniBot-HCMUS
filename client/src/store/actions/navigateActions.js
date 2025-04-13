export const NAVIGATE = "NAVIGATE";
export const NAVIGATE_SUBNAV = "NAVIGATE_SUBNAV";

export const navigate = (navigate) => {
  return {
    type: NAVIGATE,
    payload: navigate,
  };
};

export const navigate_subnav = (navigate) => {
  return {
    type: NAVIGATE_SUBNAV,
    payload: navigate,
  };
};
