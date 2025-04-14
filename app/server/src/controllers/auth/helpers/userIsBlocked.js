import { buildErrObject } from '../../../middlewares/utils'
/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
export const userIsBlocked = (user = {}) => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      return reject(buildErrObject(409, 'BLOCKED_USER'))
    }
    resolve(true)
  })
}

export default userIsBlocked
