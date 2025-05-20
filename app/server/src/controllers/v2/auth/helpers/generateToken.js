import { sign } from 'jsonwebtoken'
import { encrypt } from '../../../../middlewares/auth'

/**
 * Generates a token
 * @param {Object} user - user object
 */
export const generateToken = (user = null) => {
  const JWT_EXPIRATION_IN_MINUTES = process.env?.JWT_EXPIRATION_IN_MINUTES || '4320'
  const JWT_SECRET = process.env?.JWT_SECRET || 'chatbot_khtn'

  try {
    if (!user) { throw ''}

    const expiration =
      Math.floor(Date.now() / 1000) + 60 * JWT_EXPIRATION_IN_MINUTES

    const data = { _id: user }
    const payload =
      { data, exp: expiration }
    const text =
      sign( payload, JWT_SECRET )

    return encrypt(text)

  } catch (error) {
    throw { message: 'AUTH.ERR_GENERATE_TOKEN',
      details: 'An error occurred while generating the authentication token.' }
  }
}

export default generateToken
