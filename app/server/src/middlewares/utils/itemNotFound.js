const { buildErrObject } = require('./buildErrObject')

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {string} message - message
 */
const itemNotFound = (err = {}, item = {}, message = 'NOT_FOUND', details = 'Item not found') => {

  return new Promise((resolve, reject) => {
    if (err) {
      return reject(buildErrObject(422, 'ERR_SYSTEM', err.message ))
    }
    if (!item) {
      return reject(buildErrObject(404, message, details ))
    }
    resolve()
  })
}

module.exports = { itemNotFound }
