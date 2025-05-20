const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

import getRequest from '../../../controllers/v1/chatbot/getRequest'
import roleAuthorization from '../../../controllers/v1/auth/roleAuthorization'
import postRequest from '../../../controllers/v1/chatbot/postRequest'

router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['administrator']),
  trimRequest.all,
  getRequest
)

router.post(
  '/:id',
  requireAuth,
  roleAuthorization(['administrator']),
  trimRequest.all,
  postRequest
)

module.exports = router