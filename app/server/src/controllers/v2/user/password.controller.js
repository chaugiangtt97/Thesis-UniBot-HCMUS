import { matchedData } from 'express-validator'
import { buildErrObject, handleError, isIDGood } from '../../../middlewares/utils'
import findUser from './helpers/findUser'
import { checkPassword } from '~/middlewares/auth'
import checkRequiredData from '~/utils/checkRequiredData'
import save_new_password from './helpers/save_new_password'

export const reset_by_current_password = async (req, res) => {
  try {
    checkRequiredData(req.body, ['password', 'newPassword'])
    const data = matchedData(req)
    const user_id = isIDGood(data._id)

    const currentPassword = data.password
    const user = await findUser(null, user_id)

    const isPasswordMatch = await checkPassword(data.password, user)

    if (!isPasswordMatch) {
      throw buildErrObject(409, 'USER.WRONG_PASSWORD', 'password does not match')
    }

    await save_new_password(user_id, currentPassword)

    return res.status(200).json({ message: 'PASSWORD_UPDATED_SUCCESSFULLY' })

  } catch (error) {
    handleError(res, error)
  }
}

export const reset_by_verfication_code = async (req, res) => {
  try {
    checkRequiredData(req.body, ['email', 'verificationCode', 'newPassword'])
    const data = matchedData(req)

    const email = data.email

    const user = await findUser(email, null)

    if ( user.verification != data.verificationCode )
      throw buildErrObject(409, 'USER.WRONG_VERIFICATION_CODE', 'verificationCode does not match')

    await save_new_password(user._id, data.newPassword)

    return res.status(200).json({ message: 'PASSWORD_UPDATED_SUCCESSFULLY' })

  } catch (error) {
    handleError(res, error)
  }
}