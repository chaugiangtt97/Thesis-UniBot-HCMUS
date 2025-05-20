import generateToken from './generateToken'

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
export const returnRegisterToken = ( id = null, userInfo = null ) => {
  return {
    token: generateToken(id),
    user: userInfo
  }
}

export default returnRegisterToken
