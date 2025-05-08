import { handleError, buildErrObject } from '../../../middlewares/utils'
import { check, validationResult } from 'express-validator'
/**
 * Validates register request
 */
export const validateRegister = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  // .custom((value) => {
  // if (!(value.endsWith('@clc.fitus.edu.vn') || value.endsWith('hcmus.edu.vn'))) {
  //   throw new Error('Email phải có tên miền @hcmus.edu.vn hoặc @clc.fitus.edu.vn')
  // }
  //   return true
  // }),
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
  check('educationRole')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((value) => {
      if (value !== 'student' && value !== 'lecturer') {
        throw new Error('INVALID_EDUCATION_ROLE')
      }
      return true
    }),
  check('academicInformation'),
  check('generalInformation'),
  check('captchaToken'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      if (req.body.email) {
        req.body.email = req.body.email.toLowerCase()
      }
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, err.array()))
    }
    // validateResult(req, res, next)
  }
]

export default validateRegister
