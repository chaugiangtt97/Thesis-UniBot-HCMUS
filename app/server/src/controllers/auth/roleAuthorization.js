import { checkPermissions } from './helpers'

import { handleError } from '../../middlewares/utils'

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
export const roleAuthorization = (roles) => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles
    }
    await checkPermissions(data, next)
  } catch (error) {
    handleError(res, error)
  }
}

export default roleAuthorization
