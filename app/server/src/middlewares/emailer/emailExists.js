import User from '../../models/user'
import { buildErrObject } from '../../middlewares/utils'

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
export const emailExists = (email = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
          return reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'))
        }
        resolve(false)
      }
    )
  })
}

export default emailExists
