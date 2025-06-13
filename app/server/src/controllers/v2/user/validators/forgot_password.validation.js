import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check, validationResult } from 'express-validator'

export const validateForgotPassword = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('newPassword')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('NEW_PASSWORD_IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('verificationCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('VALIDATION_CODE_IS_EMPTY')
    .isLength({
      min: 4
    }),
  (req, res, next) => {
    try {
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, 'USER.INVALID_FORGOT_PASSWORD_VALIDATION', err.array()))
    }
  }
]

export default validateForgotPassword
