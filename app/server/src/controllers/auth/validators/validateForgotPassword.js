import { validateResult } from '../../../middlewares/utils'
import { check } from 'express-validator'

/**
 * Validates forgot password request
 */
const validateForgotPassword = [
  check('_id'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password'),
  check('newPassword'),
  check('verification'),
  (req, res, next) => {

    // Kiểm tra nếu thiếu cả _id và email
    if (!req.body._id && !req.body.email) {
      return res.status(400).json({
        errors: [{ msg: 'MISSING_ID_OR_EMAIL' }]
      })
    }

    validateResult(req, res, next)
  }
]

export default validateForgotPassword
