/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
export const getUserInfo = (req = {}) => {

  return {
    name: req?.name,
    email: req?.email,
    role: req?.educationRole || req?.role,
    generalInformation: req?.generalInformation
  }

}

export default getUserInfo
