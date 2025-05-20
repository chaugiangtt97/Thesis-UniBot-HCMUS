import { handleError, buildErrObject } from '../../../../middlewares/utils'
import { check, validationResult } from 'express-validator'
/**
 * Validates register request
 */
/**
 * Validates login request
 */
export const validateGetConfigs = [
  check('code')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, 'AUTH.INVALID_CONFIGS_VALIDATION', err.array()))
    }
    // validateResult(req, res, next)
  }
]

export default validateGetConfigs
