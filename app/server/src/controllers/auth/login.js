import { matchedData } from 'express-validator'

import { findUser, saveUserAccessAndReturnToken } from './helpers'

import { handleError, buildErrObject } from '../../middlewares/utils'
import { checkPassword } from '../../middlewares/auth'
import reCAPTCHA from './helpers/reCAPTCHA'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const node_env = process.env.NODE_ENV

    if (node_env == 'production') {
      if (!data.captchaToken) {
        handleError(res, buildErrObject(422, 'Captcha token is required.'))
        return
      }
    }

    // eslint-disable-next-line no-console
    if (!(await reCAPTCHA(data.captchaToken)) && node_env == 'production') {
      // eslint-disable-next-line no-console
      console.log('Captcha verification failed')
      throw buildErrObject(422, 'Invalid captcha token.')
    }

    const user = await findUser(data.email)

    if (user == null) {
      handleError(res, buildErrObject(422, 'Account not exists.'))
    }

    const isPasswordMatch = await checkPassword(data.password, user)

    if (!isPasswordMatch ) {
      console.log('isPasswordMatch not')
      throw buildErrObject(409, 'WRONG_PASSWORD')

    } else if (user?.verified) {
      res.status(200).json(await saveUserAccessAndReturnToken(req, user))

    } else {
      throw buildErrObject(422, 'The account has not been email verified.')
    }
    return
  } catch (error) {
    handleError(res, error)
  }
}

export default login