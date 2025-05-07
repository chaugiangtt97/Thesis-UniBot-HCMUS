
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

import validateRegister from '../../controllers/auth/validators/validateRegister'
import validateVerifyEmail from '../../controllers/auth/validators/validateVerifyEmail'
import validateLogin from '../../controllers/auth/validators/validateLogin'
import validateForgotPassword from '../../controllers/auth/validators/validateForgotPassword'

import login from '../../controllers/auth/login'
import register from '../../controllers/auth/register'
import { feedback } from '../../controllers/auth/feedback'
import validateEmail from '../../controllers/auth/validateEmail'
import request_validateEmail from '../../controllers/auth/request_validateEmail'
import { updatePassword } from '../../controllers/auth'

router.post('/login', trimRequest.all, validateLogin, login)
router.post('/register', trimRequest.all, validateRegister, register)
router.post('/feedback', requireAuth, trimRequest.all, feedback)
router.get('/verifyEmail', trimRequest.all, validateEmail)
router.get('/request_verifyEmail', trimRequest.all, validateVerifyEmail, request_validateEmail)
router.post('/updatePassword', trimRequest.all, validateForgotPassword, updatePassword)

module.exports = router