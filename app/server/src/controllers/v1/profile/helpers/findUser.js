import User from '../../../../models/user'
import { buildErrObject } from '../../../../middlewares/utils/buildErrObject'

/**
 * Finds user by id
 * @param {string} id - user id
 */
export const findUser = (id = '') => {
  User.findById(id, 'password email').then((item) => {
    if (!item) {
      throw buildErrObject(404, 'USER_DOES_NOT_EXIST')
    }
    return
  }).catch((err) => {
    return buildErrObject(422, err.message, 'Lỗi Tìm Thông Tin User ' + err.message )
  })
}

export default findUser
