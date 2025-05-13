const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

import roleAuthorization from '../../../controllers/auth/roleAuthorization'
import getAPI_Configurations from '../../../controllers/config/api_configurations '
import validateAPI_Configurations from '../../../controllers/config/validators/validateUpdateProfile'

router.get(
  '/',
  requireAuth,
  roleAuthorization(['administrator']),
  trimRequest.all,
  validateAPI_Configurations,
  getAPI_Configurations
)

module.exports = router