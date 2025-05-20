const User = require('../../../../models/user')
const {
  buildErrObject
} = require('../../../../middlewares/utils')

/**
 * reset password by id or email
 * @param {Object} user_id - user id
 * @param {Object} newPassword - new password
 */
export const save_new_password = async (user_id = null, newPassword = null) => {
  try {
    if (!newPassword)
      throw buildErrObject(422, 'USER.NEWPASSWORD_EMPTY', 'can not update password')

    return User
      .findOneAndUpdate(
        { _id: user_id },
        { password: newPassword },
        { new: true }
      ).catch((err) => { throw buildErrObject(422, 'PASSWORD_UPDATED_UNSUCCESSFULLY', err )})

  } catch (e) {
    throw buildErrObject(422, 'USER.PASSWORD.ERR.RESET', e)
  }
}

export default save_new_password