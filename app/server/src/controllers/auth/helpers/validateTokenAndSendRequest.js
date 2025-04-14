import User from '../../../models/user'
import { itemNotFound, buildErrObject } from '../../../middlewares/utils'
import { prepareToSendEmail } from '../../../middlewares/emailer'

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
export const validateTokenAndSendRequest = async (email = '') => {
  const items = await User.findOne({ email }).then(async (item) => {
    await itemNotFound(false, item, 'USER_DOES_NOT_EXIST')
    if (item) {
      if (item?.verified) {
        throw buildErrObject(404, 'THIS ACCOUNT HAVE BEEN VERIFIED')
      }
      prepareToSendEmail(item)
    } else {
      throw buildErrObject(404, 'USER_DOES_NOT_EXIST')
    }
    return {}
  }).catch(async (err) => {
    await itemNotFound(err, null, 'USER_DOES_NOT_EXIST')
    throw buildErrObject(404, err.message)
  })
  return items
}

export default validateTokenAndSendRequest
