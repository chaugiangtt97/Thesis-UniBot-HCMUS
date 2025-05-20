
import { passwordsDoNotMatch, saveUserAccessAndReturnToken } from './helpers'

import { handleError, buildErrObject } from '../../../middlewares/utils'
import { checkPassword } from '../../../middlewares/auth'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const resetPassword = async (req, res) => {
  try {
    const user = req?.user
    if (user == null) {
      handleError(res, buildErrObject(422, 'Account not exists.'))
    }

    const isPasswordMatch = await checkPassword(req?.password, user)

    if (!isPasswordMatch ) {
      handleError(res, await passwordsDoNotMatch(user))
    } else if (user?.verified) {
      res.status(200).json(await saveUserAccessAndReturnToken(req, user))
    } else {
      handleError(res, buildErrObject(422, 'The account has not been email verified.'))
      return
    }
  } catch (error) {
    handleError(res, error)
  }
}

export default resetPassword