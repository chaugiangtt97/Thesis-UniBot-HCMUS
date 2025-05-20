
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

import validateRegister from '../../controllers/v1/auth/validators/validateRegister'
import validateVerifyEmail from '../../controllers/v1/auth/validators/validateVerifyEmail'
import validateLogin from '../../controllers/v1/auth/validators/validateLogin'
// import validateForgotPassword from '../../controllers/auth/validators/validateForgotPassword'

import login from '../../controllers/v1/auth/login'
import feedback from '../../controllers/v1/profile/feedback'
import register from '../../controllers/v1/auth/register'
import verifyToken from '../../controllers/v1/auth/verifyToken'
import validateEmail from '../../controllers/v1/auth/validateEmail'
import getAPI_Configurations from '~/controllers/v1/auth/api_configurations '
import requestVerification from '../../controllers/v1/auth/requestVerification'

router.post('/login', trimRequest.all, validateLogin, login)
router.post('/register', trimRequest.all, validateRegister, register)

router.get('/captcha', trimRequest.all, getAPI_Configurations)
router.post('/verify-token', trimRequest.all, verifyToken)

router.get('/email/verify', trimRequest.all, validateEmail)
router.get('/email/request-verification', trimRequest.all, validateVerifyEmail, requestVerification)

router.post('/feedback', requireAuth, trimRequest.all, feedback) // NEED CHANGE
// router.post('/updatePassword', trimRequest.all, validateForgotPassword, updatePassword) // NEED TO CHANGE

module.exports = router