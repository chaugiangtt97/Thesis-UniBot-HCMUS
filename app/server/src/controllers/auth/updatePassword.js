/* eslint-disable no-console */
const { matchedData } = require('express-validator')
const { findUser } = require('./helpers')
const { handleError, buildErrObject } = require('../../middlewares/utils')
const { saveNewPassword } = require('./helpers/saveNewPassword')
const { checkPassword } = require('../../middlewares/auth')

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updatePassword = async (req, res) => {
  try {
    const data = matchedData(req)
    let user = null

    if (data?.email) {
      user = await findUser(data.email)
    } else if (data?._id) {
      user = await findUser(null, data._id)
    }

    if (data?.password) {
      const isPasswordMatch = await checkPassword(data.password, user)
      if (!isPasswordMatch) {
        throw buildErrObject(409, 'WRONG_PASSWORD')
      }
      await saveNewPassword(req)
      return res.status(200).json({
        message: 'PASSWORD_UPDATED_SUCCESSFULLY'
      })
    }

    if (user.verification === data.verification) {

      await saveNewPassword(req)

      return res.status(200).json({
        message: 'PASSWORD_UPDATED_SUCCESSFULLY'
      })
    } else {
      throw buildErrObject(409, 'WRONG_VERIFICATION_CODE')
    }


  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updatePassword }
