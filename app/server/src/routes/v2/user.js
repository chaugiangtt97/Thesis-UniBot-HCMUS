const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

const {
  get_profile,
  update_profile
} = require('../../controllers/v2/user/profile.controller')

const {
  reset_by_current_password,
  reset_by_verfication_code
} = require('~/controllers/v2/user/password.controller')

const { default: validateForgotPassword } = require('~/controllers/v2/user/validators/forgot_password.validation')
const { default: validateResetPassword } = require('~/controllers/v2/user/validators/reset_password.validator')


router.get('/profile', requireAuth, trimRequest.all, get_profile)
router.post('/profile', requireAuth, trimRequest.all, update_profile)

router.post('/reset-password', requireAuth, trimRequest.all, validateResetPassword, reset_by_current_password)
router.post('/forgot-password', trimRequest.all, validateForgotPassword, reset_by_verfication_code)


module.exports = router