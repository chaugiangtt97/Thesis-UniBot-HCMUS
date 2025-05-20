import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check, validationResult } from 'express-validator'

export const validateVerifyEmail = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      if (req.body.email) req.body.email = req.body.email.toLowerCase()
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, 'AUTH.EMAIL.INVALID_VERIFY_VALIDATION', err.array()))
    }
  }
]

export default validateVerifyEmail
