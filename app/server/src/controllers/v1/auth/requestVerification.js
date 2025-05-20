/* eslint-disable no-console */
import { validateTokenAndSendRequest } from './helpers'

import { handleError } from '../../../middlewares/utils'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const requestVerification = async (req, res) => {
  try {
    const email = req.query?.email
    const code = req.query?.code
    const captchaToken = req.query?.captchaToken

    if ( email ) {
      return res.status(200).json( await validateTokenAndSendRequest(email, code, captchaToken) )
    }
    return res.status(200).json({
      message: 'Xác Thực ID hoặc Email Không tồn tại'
    })
  } catch (error) {
    handleError(res, error)
  }
}

export default requestVerification
