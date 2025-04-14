import { validateTokenAndSendRequest } from './helpers'

import { handleError } from '../../middlewares/utils'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const request_validateEmail = async (req, res) => {
  try {
    const id = req.query?.email
    if ( id ) {
      return res.status(200).json( await validateTokenAndSendRequest(id))
    }
    return res.status(200).json({
      message: 'Xác Thực ID Không tồn tại'
    })
  } catch (error) {
    handleError(res, error)
  }
}

export default request_validateEmail
