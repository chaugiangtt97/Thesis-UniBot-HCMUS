import { isIDGood, handleError } from '../../middlewares/utils'
import { matchedData } from 'express-validator'
import { getDataToDashboard } from './helpers'

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const dashboardData = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    req = matchedData(req)
    res.status(200).json(await getDataToDashboard(req, id))
  } catch (error) {
    handleError(res, error)
  }
}

export default dashboardData