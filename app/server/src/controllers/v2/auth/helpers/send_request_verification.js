/* eslint-disable indent */
import User from '../../../../models/user'
import { buildErrObject } from '../../../../middlewares/utils'
import { prepareToSendEmail } from '../../../../middlewares/emailer'

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
export const send_request_verification = async ( email = '', code = null ) => {
  try {
    if ( code == null )
      throw buildErrObject(400, 'EMAIL.CODE_EMPTY', 'Code must be required!')

    await User.findOneAndUpdate({ email },
      { $set:
        {
          verification: Math.floor(100000 + Math.random() * 900000)
        }
      })

    return await User.findOne({ email }).then(async (users) => {
      if (!users) {
        throw buildErrObject(404, 'EMAIL.USER_NOT_FOUND', 'user not found')
      }

      switch (code) {
        case 'VERIFY_EMAIL':
          if (users?.verified) throw buildErrObject(404, 'THIS ACCOUNT HAVE BEEN VERIFIED')
          break
        case 'FORGOT_PASSWORD':
          break
        default:
          throw buildErrObject(404, 'EMAIL.INVALID_CODE', 'invalid code')
      }

      if (users?.educationRole == 'administrator') {
        throw buildErrObject(404, 'EMAIL.ADMIN_ACCOUNT')
      }
      // eslint-disable-next-line no-console
      console.log('Repair to send email')
      prepareToSendEmail(users, code)
      return {
        temp_id: users._id,
        email: users.email,
        educationRole: users.educationRole
      }
    }).catch(async (err) => {
      throw buildErrObject(404, 'EMAIL.ERR_SEND_REQUEST', err)
    })
  } catch (err) {
    throw buildErrObject(404, 'EMAIL.ERR_SEND_REQUEST', err)
  }

}

export default send_request_verification
