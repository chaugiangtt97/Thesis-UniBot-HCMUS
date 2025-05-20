/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
export const buildErrObject = (code = '', message = '', detail = null) => {
  return {
    code,
    message,
    detail
  }
}

export default buildErrObject
