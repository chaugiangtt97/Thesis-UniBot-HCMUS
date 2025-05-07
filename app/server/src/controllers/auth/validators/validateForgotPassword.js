import { validateResult } from '../../../middlewares/utils'
import { check } from 'express-validator'

/**
 * Validates forgot password request
 */
const validateForgotPassword = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password'),
  check('newPassword'),
  check('verification'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

export default validateForgotPassword
