import { buildErrObject } from '../../../../middlewares/utils'
const LOGIN_ATTEMPTS = 5

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
export const passwordsDoNotMatch = async (user = {}) => {
  const run = async () => {
    try {
      if (user.loginAttempts <= LOGIN_ATTEMPTS) {
        throw buildErrObject(409, 'WRONG_PASSWORD')
      }
      // await blockUser(user)
    } catch (error) {
      // TODO :
      throw buildErrObject(409, error.message)
    }
  }
  const res = run()
  return res
}

export default passwordsDoNotMatch
