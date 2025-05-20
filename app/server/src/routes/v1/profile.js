const express = require('express')
const router = express.Router()
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

import validateUpdateProfile from '../../controllers/v1/profile/validators/validateUpdateProfile'

import get_profile from '../../controllers/v1/profile/get_profile'
import updateProfile from '../../controllers/v1/profile/updateProfile'
import dashboardData from '../../controllers/v1/profile/dashboardData'
import roleAuthorization from '../../controllers/v1/auth/roleAuthorization'
import feedback from '../../controllers/v1/profile/feedback'

router.get('/', requireAuth, trimRequest.all, get_profile)
router.patch('/', requireAuth, trimRequest.all, validateUpdateProfile, updateProfile)

router.post('/feedback', requireAuth, trimRequest.all, feedback) // NEED CHANGE
router.get('/dashboard', requireAuth, roleAuthorization(['administrator', 'lecturer']), trimRequest.all, dashboardData ) // NEED TO CHANGE

module.exports = router