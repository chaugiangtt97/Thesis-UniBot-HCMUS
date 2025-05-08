import User from '../../../models/user'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getUserByToken = async (id = '') => {

  const result = await User.findById(id, '-_id email name role educationRole academicInformation generalInformation').then((user) => {
    if (!user) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return {
      email: user?.email,
      name: user?.name,
      generalInformation: user?.generalInformation,
      academicInformation: user?.academicInformation,
      role: user?.educationRole
    }
  }).catch((err) => {
    throw buildErrObject(422, err.message, 'Lỗi Khi Lấy Profile Người Dùng Từ DB: ' + err.message)
  })

  return result
}

export default getUserByToken
