import User from '../../../../../models/user'
import { buildErrObject } from '../../../../../middlewares/utils'

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
export const checkEmailExists = async (email = null) => {
  if (!email) {
    throw buildErrObject(422, 'AUTH.ERR_CHECK_EMAIL_EXIST', 'email must be required to existed check in db')
  }

  return await User.findOne({ email })
    .then((item) => item === null ? false : true)
    .catch((err) => { throw buildErrObject(422, 'AUTH.ERR_CHECK_EMAIL_EXIST', err.message) })
}

export default checkEmailExists
