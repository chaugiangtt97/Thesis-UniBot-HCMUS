import User from '../../../models/user'
import { itemNotFound, buildErrObject } from '../../../middlewares/utils'
import { prepareToSendEmail } from '../../../middlewares/emailer'

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
export const validateTokenAndSendRequest = async ( email = '', code = null, captchaToken = null) => {
  await User.findOneAndUpdate({ email }, { $set: { verification: Math.floor(100000 + Math.random() * 900000) } })

  const items = await User.findOne({ email }).then(async (users) => {
    await itemNotFound(false, users, 'USER_DOES_NOT_EXIST')
    if (users) {

      if (users?.verified && code == null) {
        throw buildErrObject(404, 'THIS ACCOUNT HAVE BEEN VERIFIED')
      }

      if (!users?.educationRole == 'administrator')
        prepareToSendEmail(users, 'VERIFY_EMAIL')

    } else {
      throw buildErrObject(404, 'USER_DOES_NOT_EXIST')
    }

    return {
      temp_id: users._id,
      email: users.email,
      educationRole: users.educationRole
    }
  }).catch(async (err) => {
    await itemNotFound(err, null, 'USER_DOES_NOT_EXIST')
    throw buildErrObject(404, err.message)
  })
  return items
}

export default validateTokenAndSendRequest
