import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check } from 'express-validator'
import { validateResult } from '../../../../middlewares/utils'

export const validateVerifyEmail = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('verificationCode')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('captchaToken'),
  (req, res, next) => {
    try {
      validateResult(req, res, next)
    } catch (err) {
      return handleError(res, buildErrObject(422, 'AUTH.EMAIL.INVALID_VERIFY_VALIDATION', err))
    }
  }
]

export default validateVerifyEmail
