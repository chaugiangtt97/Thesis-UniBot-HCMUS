const { validationResult } = require('express-validator')

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body?.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    throw err.array()
  }
}

module.exports = { validateResult }
