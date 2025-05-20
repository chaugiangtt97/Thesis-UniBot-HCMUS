import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check, validationResult } from 'express-validator'

export const validateRegister = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('captchaToken'),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('educationRole')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((value) => {
      if (value !== 'student' && value !== 'lecturer') throw new Error('INVALID_EDUCATION_ROLE')
      return true
    }),
  check('academicInformation'),
  check('generalInformation'),
  check('captchaToken'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      if (req.body.email) req.body.email = req.body.email.toLowerCase()
      if (!req.body?.academicInformation) req.body.academicInformation = []
      if (!req.body?.generalInformation) req.body.generalInformation = []
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, 'AUTH.INVALID_REGISTER_VALIDATION', err.array()))
    }
  }
]

export default validateRegister
