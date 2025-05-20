import User from '../../../../../models/user'
import { buildErrObject } from '../../../../../middlewares/utils'

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
export const validateVerificationAndUpdate = async (user_id = '') => {

  return User.findOneAndUpdate({ _id: user_id }, { $set: { verified: true } }, { new: true })
    .then((user) => {
      if (user) {
        return { 'message': 'Đăng Kí Thành Công' }
      }

      throw buildErrObject(422, 'AUTH.EMAIL.INVALID_ID', 'ID user Không Hợp Lệ')
    }).catch((e) => {
      throw buildErrObject(422, e.message)
    })
}

export default validateVerificationAndUpdate
