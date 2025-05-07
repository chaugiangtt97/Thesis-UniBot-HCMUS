import User from '../../../models/user'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getProfileFromDB = async (id = '') => {

  const result = await User.findById(id, '-_id').then((user) => {
    if (!user) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return {
      name: user.name,
      email: user.email,
      role: user.educationRole,
      academicInformation: user.academicInformation,
      generalInformation: user.generalInformation,
      updatedAt: user.updatedAt
    }
  }).catch((err) => {
    throw buildErrObject(422, err.message, 'Lỗi Cập Nhật Profile Người Dùng: ' + err.message)
  })

  return result
}

export default getProfileFromDB