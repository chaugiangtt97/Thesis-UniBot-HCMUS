import { buildErrObject, handleError } from '../../../middlewares/utils'
import validateVerificationAndUpdate from './email/helpers/validateVerificationAndUpdate'
import findUser from './helpers/findUser'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const verify_email = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    const verificationCode = req.body?.verificationCode
    const email = req.body?.email
    const user = await findUser(email)

    if ( !user?.verification && verificationCode != user?.verification)
      throw buildErrObject(422, 'AUTH.EMAIL.USER_NOT_FOUND', 'Xác Thực ID Không tồn tại!')

    if ( user._id ) {
      return res.status(200).json( await validateVerificationAndUpdate(user._id))
    }

    throw buildErrObject(422, 'AUTH.EMAIL.USER_NOT_FOUND', 'User Không tồn tại!')
  } catch (error) {
    handleError(res, error)
  }
}

export default verify_email