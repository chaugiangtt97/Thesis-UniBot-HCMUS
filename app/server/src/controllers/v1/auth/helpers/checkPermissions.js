import User from '../../../../models/user'
import { buildErrObject } from '../../../../middlewares/utils'

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
export const checkPermissions = async ({ id = '', roles = [] }, next) => {
  await User.findById(id).then(async (result) => {
    if (!result) {
      throw buildErrObject(404, 'USER_NOT_FOUND')
    }
    if (roles.indexOf(result?.educationRole.toLowerCase()) > -1) {
      return next()
    }
    throw buildErrObject(401, 'UNAUTHORIZED')
  }).catch(async (err) => {
    throw buildErrObject(422, err.message)
  })
}

export default checkPermissions
