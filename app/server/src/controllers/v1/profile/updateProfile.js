import { isIDGood, handleError } from '../../../middlewares/utils'
import { matchedData } from 'express-validator'
import { updateProfileInDB } from './helpers'

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const updateProfile = async (req, res) => {
  try {
    req = matchedData(req)
  
    const id = await isIDGood(req.user._id)
    res.status(200).json(await updateProfileInDB(req, id))
  } catch (error) {
    handleError(res, error)
  }
}

export default updateProfile