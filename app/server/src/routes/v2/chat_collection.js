const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

const {
  get_chat_collection,
  create_chat_collection,
  delete_chat_collection
} = require('~/controllers/v2/chat_collection/chat_collection.controller')
const { default: get_schema } = require('~/controllers/v2/chat_collection/schema.controller')

router.get('/', requireAuth, trimRequest.all, get_chat_collection)
router.post('/', requireAuth, trimRequest.all, create_chat_collection)
router.delete('/', requireAuth, trimRequest.all, delete_chat_collection)

router.post('/schema', requireAuth, trimRequest.all, get_schema)

module.exports = router