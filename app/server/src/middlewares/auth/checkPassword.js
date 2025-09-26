import buildErrObject from '../utils/buildErrObject'

/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
export const checkPassword = async (password = '', user = {}) => {

  return await new Promise((resolve, reject) => {
    try {
      user.comparePassword(password,
        (err, isMatch) => {
          if (err)
          {
              console.log(buildErrObject(422, err.message))
              return reject(false)
          }
          return resolve(isMatch)
        })
    } catch (error) {
      return resolve(false)
    }
  })
}

export default checkPassword
