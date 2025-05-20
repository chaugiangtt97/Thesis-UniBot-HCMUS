import { buildErrObject } from '../../../../middlewares/utils'

/**
 *
 * @param {Object} user - user object.
 */
export const checkLoginAttemptsAndBlockExpires = (user = {}) => {

  const LOGIN_ATTEMPTS = 5

  const blockIsExpired = ({ loginAttempts = 0, blockExpires = '' }) =>
    loginAttempts > LOGIN_ATTEMPTS && blockExpires <= new Date()

  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0
      user.save((err, result) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        if (result) {
          return resolve(true)
        }
      })
    }
    // User is not blocked, check password (normal behaviour)
    resolve(true)
  })
}

export default checkLoginAttemptsAndBlockExpires
