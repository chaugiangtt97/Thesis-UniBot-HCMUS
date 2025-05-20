import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check, validationResult } from 'express-validator'
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
      validationResult(req).throw()
      if (req.body.email) req.body.email = req.body.email.toLowerCase()
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, 'AUTH.INVALID_LOGIN_VALIDATION', err.array()))
    }
    // validateResult(req, res, next)
  }
]

export default validateLogin
