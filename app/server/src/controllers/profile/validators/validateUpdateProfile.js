import { handleError, buildErrObject } from '../../../middlewares/utils'
// import validator = require('validator'
import { check, validationResult } from 'express-validator'

/**
 * Validates update profile request
 */
export const validateUpdateProfile = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('generalInformation'),
  check('academicInformation'),
  // TODO
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

export default validateUpdateProfile
