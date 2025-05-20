import { validateTokenAndUpdate } from './helpers'

import { buildErrObject, handleError } from '../../../middlewares/utils'

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const validateEmail = async (req, res) => {
  try {
    const id = req.query?._id

    if ( id ) {
      return res.status(200).json( await validateTokenAndUpdate(id))
    }

    throw buildErrObject(422, 'Xác Thực ID Không tồn tại!')
  } catch (error) {
    handleError(res, error)
  }
}

export default validateEmail