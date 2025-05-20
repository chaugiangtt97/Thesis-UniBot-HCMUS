
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

const { default: validateLogin } = require('../../controllers/v2/auth/validators/login.validator.js')
const { default: validateRegister } = require('../../controllers/v2/auth/validators/register.validator')
const { default: validateVerifyEmail } = require('../../controllers/v2/auth/validators/verify_email.validator')

const { default: login_controller } = require('../../controllers/v2/auth/login.controller.js')
const { default: register_controller } = require('../../controllers/v2/auth/register.controller.js')
const { default: login_by_token } = require('../../controllers/v2/auth/login_by_token.controller.js')
const { default: verify_email } = require('../../controllers/v2/auth/verify_email.controller.js')
const { default: request_verification } = require('../../controllers/v2/auth/request_verification.controller.js')

// 🔐 Auth
router.post('/login', trimRequest.all, validateLogin, login_controller)
router.post('/register', trimRequest.all, validateRegister, register_controller)

// // 🔐 Token
router.post('/login-by-token', requireAuth, trimRequest.all, login_by_token)

// // 📧 Email verification
router.post('/email/verify', trimRequest.all, validateVerifyEmail, verify_email)
router.post('/email/request-verification', trimRequest.all, request_verification)

// // 📝 Feedback
// router.post('/feedback', requireAuth, trimRequest.all, feedback)

module.exports = router