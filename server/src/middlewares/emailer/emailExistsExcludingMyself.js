import User from '../../models/user'
import { buildErrObject } from '../../middlewares/utils'

/**
 * Checks User model if user with an specific email exists but excluding user id
 * @param {string} id - user id
 * @param {string} email - user email
 */
export const emailExistsExcludingMyself = (id = '', email = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
        _id: {
          $ne: id
        }
      },
      async (err, item) => {
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

export default emailExistsExcludingMyself
