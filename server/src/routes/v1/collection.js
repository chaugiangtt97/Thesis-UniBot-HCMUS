const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
// const {
//   loadCollectionsList,
//   loadDocumentList,
//   getCollectionSchema
// } = import '../../controllers/collection')

import loadCollectionsList from '../../controllers/collection/loadCollectionList'
import loadDocumentList from '../../controllers/collection/loadDocumentList'
import getCollectionSchema from '../../controllers/collection/getCollectionSchema'
import new_collection from '../../controllers/collection/newCollection'
import remove_collection from '~/controllers/collection/removeCollection'

router.get('/', requireAuth, trimRequest.all, loadCollectionsList)
router.get('/schema', requireAuth, trimRequest.all, getCollectionSchema)
router.get('/documents', requireAuth, trimRequest.all, loadDocumentList)
router.post('/new_collection', requireAuth, trimRequest.all, new_collection)
router.post('/remove_collection', requireAuth, trimRequest.all, remove_collection)

module.exports = router