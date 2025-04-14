import { isIDGood, handleError } from '../../middlewares/utils'
import { getProfileFromDB } from './helpers'

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getProfile = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const user_info = await getProfileFromDB(id)
    res.status(200).json(user_info)
  } catch (error) {
    handleError(res, error)
  }
}

export default getProfile
