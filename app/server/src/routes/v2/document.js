const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
// const passport = require('passport')
// const requireAuth = passport.authenticate('jwt', { session: false })

const { get_document } = require('~/controllers/v2/documents/document.controller')

router.get('/', trimRequest.all, get_document)

module.exports = router
