import buildErrObject from '../utils/buildErrObject'

/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
export const checkPassword = async (password = '', user = {}) => {

  return new Promise((resolve, reject) => {
    try {
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        if (!isMatch) {
          resolve(false)
        }
        resolve(true)
      })
    } catch (error) {
      resolve(false)
    }
  })

}

export default checkPassword
