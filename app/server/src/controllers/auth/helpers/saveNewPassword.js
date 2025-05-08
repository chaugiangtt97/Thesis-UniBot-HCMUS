const User = require('../../../models/user')
const {
  buildErrObject
} = require('../../../middlewares/utils')

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveNewPassword = async (req = {}, code = '') => {
  if (req.body?._id) {
    return User.findOneAndUpdate(
      { _id: req.body._id },
      { password: req.body.newPassword },
      { new: true }
    ).then((userinfo) => {
      return userinfo
    }).catch((err) => {
      if (err) {
        throw buildErrObject(422, 'PASSWORD_UPDATED_UNSUCCESSFULLY')
      }
    })
  }

  return User.findOneAndUpdate(
    { email: req.body.email },
    { password: req.body.newPassword },
    { new: true }
  ).then((userinfo) => {
    return userinfo
  }).catch((err) => {
    if (err) {
      throw buildErrObject(422, 'PASSWORD_UPDATED_UNSUCCESSFULLY')
    }
  })
}

module.exports = { saveNewPassword }