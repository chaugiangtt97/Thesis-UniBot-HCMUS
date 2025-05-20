import User from '../../../../models/user'
import { buildErrObject } from '../../../../middlewares/utils'

/**
 * Finds user by email or id
 * @param {string} user_email - user´s email
 * @param {string} user_id - user´s id
 */
export const findUser = async ( user_email = null, user_id = null) => {
  if (user_email == null && user_id == null)
    throw {
      message: 'AUTH.EMAIL_OR_ID_REQUIRED',
      details: 'Email or ID user is required to proceed.'
    }

  if (user_id) {
    try {
      return await User.findOne({ _id: user_id })
        .then(async (item) => {
          if (!item) throw { message: 'AUTH.USER_DOES_NOT_EXIST', details: 'The user does not exist.' }
          return new User(item)
        })
        .catch(async (err) => {
          throw { message: 'AUTH.ERR_FIND_USER_BY_ID', details: err }
        })

    } catch (error) {
      throw buildErrObject(300, error.message, error.details)
    }
  }

  try {
    return await User.findOne({ email: user_email }, '-_id')
      .then(async (item) => {
        if (!item) throw { message: 'AUTH.USER_DOES_NOT_EXIST', details: 'The user does not exist.' }
        return new User(item)
      })
      .catch(async (err) => {
        throw { message: 'AUTH.ERR_FIND_USER_BY_EMAIL', details: err }
      })

  } catch (error) {
    throw buildErrObject(300, error.message, error.details)
  }
}

export default findUser
