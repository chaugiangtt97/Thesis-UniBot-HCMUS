import User from '../../../models/user'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
export const updatePassword = async (req = {}, id = '') => {
  const user = await User.findByIdAndUpdate( id, req, {
    new: true,
    runValidators: true,
    select: '-password -verification -_id -createdAt'
  }).then((user) => {
    if (!user) throw buildErrObject(422, 'NOT_FOUND')
    return user
  }).catch((err) => {
    throw buildErrObject(422, err.message, 'Lỗi Cập Nhật Profile Người Dùng: ' + err.message)
  })

  return user
}

export default updatePassword
