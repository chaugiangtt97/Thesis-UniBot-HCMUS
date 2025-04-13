import User from '../../../models/user'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getProfileFromDB = async (id = '') => {

  const result = await User.findById(id, '-_id -createdAt -password').then((user) => {
    if (!user) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return user
  }).catch((err) => {
    throw buildErrObject(422, err.message, 'Lỗi Cập Nhật Profile Người Dùng: ' + err.message)
  })

  return result
}

export default getProfileFromDB