/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
export const getUserInfo = (req = {}) => {

  let user = {
    name: req.name,
    email: req.email,
    role: req?.educationRole || req?.role,
    academicInformation: req?.academicInformation,
    generalInformation: req?.generalInformation
  }

  return user
}

export default getUserInfo
