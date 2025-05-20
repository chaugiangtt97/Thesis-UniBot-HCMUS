const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

const {
  get_chat_session,
  update_chat_session,
  delete_chat_session,
  create_chat_session
} = require('../../controllers/v2/chat_session/chat_session.controller')

const {
  get_history_in_chat_session,
  create_history_in_chat_session,
  delete_history_in_chat_session,
  update_history_in_chat_session
} = require('~/controllers/v2/chat_session/history.controller')

const { get_recommended_questions } = require('~/controllers/v2/chat_session/rc_question.controller')


router.get('/', requireAuth, trimRequest.all, get_chat_session)
router.post('/', requireAuth, trimRequest.all, create_chat_session)
router.delete('/', requireAuth, trimRequest.all, delete_chat_session)
router.put('/', requireAuth, trimRequest.all, update_chat_session)

router.get('/history', requireAuth, trimRequest.all, get_history_in_chat_session)
router.post('/history', requireAuth, trimRequest.all, create_history_in_chat_session)
router.delete('/history', requireAuth, trimRequest.all, delete_history_in_chat_session)
router.put('/history', requireAuth, trimRequest.all, update_history_in_chat_session)

router.get('/recommended-questions', requireAuth, trimRequest.all, get_recommended_questions)

module.exports = router