import { matchedData } from 'express-validator'

import { registerUser, getUserInfo, returnRegisterToken } from './helpers'

import { handleError } from '../../middlewares/utils'
import { emailExists } from '../emailer'

import { prepareToSendEmail } from '../../middlewares/emailer'

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    // const locale = req.getLocale()

    req = matchedData(req)

    const doesEmailExists = await emailExists(req.email)

    if (!doesEmailExists) {
      const item = await registerUser(req)
      const userInfo = getUserInfo(item)
      const response = returnRegisterToken(item, userInfo)
      prepareToSendEmail(item)
      res.status(201).json(response)
      return
    }

    handleError(res, doesEmailExists)

  } catch (error) {
    handleError(res, error)
  }
}

export default register
