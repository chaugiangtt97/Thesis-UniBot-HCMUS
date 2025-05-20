import { handleError, buildErrObject } from '../../../../middlewares/utils'
// import validator = require('validator'
import { check, validationResult } from 'express-validator'

/**
 * Validates update profile request
 */
export const validateAPI_Configurations = [
  check('code')
    .optional().isString().withMessage('Code must be a string'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      return next()

    } catch (err) {
      return handleError(res, buildErrObject(422, err.array()))
    }
  }
]

export default validateAPI_Configurations
