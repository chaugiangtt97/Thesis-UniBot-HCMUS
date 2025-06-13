import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check } from 'express-validator'
import { validateResult } from '../../../../middlewares/utils'
/**
 * Validates register request
 */
/**
 * Validates login request
 */
export const validateLogin = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('captchaToken'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    try {
      validateResult(req, res, next)
    } catch (err) {
      throw handleError(res, buildErrObject(422, 'AUTH.INVALID_LOGIN_VALIDATION', err))
    }
  }
]

export default validateLogin
