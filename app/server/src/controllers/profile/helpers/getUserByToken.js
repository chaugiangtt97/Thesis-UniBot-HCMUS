import User from '../../../models/user'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getUserByToken = async (id = '') => {

  const result = await User.findById(id, '-_id email name role academicInformation generalInformation').then((user) => {
    if (!user) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return user
  }).catch((err) => {
    throw buildErrObject(422, err.message, 'Lỗi Khi Lấy Profile Người Dùng Từ DB: ' + err.message)
  })

  return result
}

export default getUserByToken
