const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

import {
  newChat,
  loadConservationList,
  loadHistoryInSession,
  removeConservationInDB,
  updateConservationInDB,
  getRecommendedQuestions
} from '../../controllers/v1/conservation'

router.post('/newChat', requireAuth, trimRequest.all, newChat)
router.get('/chatSession', requireAuth, trimRequest.all, loadConservationList)
router.post('/historyInChatSession', requireAuth, trimRequest.all, loadHistoryInSession)
router.delete('/removeChat', requireAuth, trimRequest.all, removeConservationInDB)
router.post('/updateChat', requireAuth, trimRequest.all, updateConservationInDB)
router.get('/recommendedQuestions', requireAuth, trimRequest.all, getRecommendedQuestions)

module.exports = router