import { sign } from 'jsonwebtoken'
import { encrypt } from '../../../middlewares/auth'

/**
 * Generates a token
 * @param {Object} user - user object
 */
export const generateToken = (user = '') => {
  try {
    // Gets expiration time
    const expiration =
      Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

    // returns signed and encrypted token
    return encrypt(
      sign(
        {
          data: {
            _id: user
          },
          exp: expiration
        },
        process.env.JWT_SECRET
      )
    )
  } catch (error) {
    return error
  }
}

export default generateToken
