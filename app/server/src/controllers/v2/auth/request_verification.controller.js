/* eslint-disable no-console */
import { buildErrObject, handleError } from '../../../middlewares/utils'

import send_request_verification from './helpers/send_request_verification'
import reCAPTCHA from './helpers/reCAPTCHA'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const request_verification = async (req, res) => {
  try {
    const email = req.body?.email
    const code = req.body?.code
    const captchaToken = req.body?.captchaToken

    const node_env = process.env?.NODE_ENV || 'development'

    if (node_env == 'production') {
      if (!captchaToken) {
        throw buildErrObject(422, 'AUTH.CAPTCHA_REQUIRED', 'captchaToken variable is required.')
      }
      await reCAPTCHA(captchaToken)
    }

    if ( email ) {
      return res.status(200).json( await send_request_verification(email, code) )
    }
    return res.status(200).json({
      message: 'Xác Thực ID hoặc Email Không tồn tại'
    })
  } catch (error) {
    handleError(res, error)
  }
}

export default request_verification
