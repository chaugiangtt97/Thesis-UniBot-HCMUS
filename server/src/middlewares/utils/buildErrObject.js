/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
export const buildErrObject = (code = '', message = '', notice = null) => {
  return {
    code,
    message,
    notice
  }
}

export default buildErrObject
