import User from '../../../../models/user'
import { buildErrObject, itemNotFound } from '../../../../middlewares/utils'

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
export const findUser = async (email = '', _id = null) => {
  if (_id) {
    try {
      return await User.findOne({ _id }).then(async (item) => {
        await itemNotFound(false, item, 'USER_DOES_NOT_EXIST')
        return new User(item)
      }).catch(async (err) => {
        await itemNotFound(err, null, 'USER_DOES_NOT_EXIST')
        throw err
      })
    } catch (error) {
      throw buildErrObject(300, error.message)
    }
  }

  try {
    const res = await User.findOne({ email }).then(async (item) => {
      await itemNotFound(false, item, 'USER_DOES_NOT_EXIST')
      return new User(item)
    }).catch(async (err) => {
      await itemNotFound(err, null, 'USER_DOES_NOT_EXIST')
      throw err
    })
    return res
  } catch (error) {
    throw buildErrObject(300, error.message)
  }
}

export default findUser
