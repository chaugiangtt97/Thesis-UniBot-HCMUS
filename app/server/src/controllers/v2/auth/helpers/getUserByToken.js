import { buildErrObject } from '../../../../middlewares/utils'
import User from '../../../../models/user'
import getUserInfo from './getUserInfo'

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getUserByToken = async (id = '') => {

  const result = await User.findById(id, '-_id email name role educationRole academicInformation generalInformation').then((user) => {
    if (!user) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return getUserInfo(user)

  }).catch((err) => {
    throw buildErrObject(422, err.message, 'Lỗi Khi Lấy Profile Người Dùng Từ DB: ' + err.message)
  })

  return result
}

export default getUserByToken
