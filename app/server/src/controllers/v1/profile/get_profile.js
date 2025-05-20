/**
 * Lấy profile của user.
 * Get profile function called by route.
 *
 * @async
 * @function get_profile
 * @param {Object} req - Request object, chứa thông tin user đã xác thực.
 * @param {Object} res - Response object, dùng để trả về thông tin profile hoặc lỗi.
 * @returns {Promise<void>} Trả về thông tin profile của user dưới dạng JSON nếu thành công, hoặc trả về lỗi nếu thất bại.
 */

import { isIDGood, handleError } from '../../../middlewares/utils'
import { getProfileFromDB } from './helpers'

export const get_profile = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const user_info = await getProfileFromDB(id)
    res.status(200).json(user_info)
  } catch (error) {
    handleError(res, error)
  }
}

export default get_profile
