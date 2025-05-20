import { v4 } from 'uuid'
import ForgotPassword from '../../../../models/forgotPassword'
import { getIP, getBrowserInfo, buildErrObject } from '../../../../middlewares/utils'

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = (req = {}) => {
  return new Promise((resolve, reject) => {
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: v4(),
      ipRequest: getIP(req),
      browserRequest: getBrowserInfo(req)
    })
    forgot.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

export default saveForgotPassword
