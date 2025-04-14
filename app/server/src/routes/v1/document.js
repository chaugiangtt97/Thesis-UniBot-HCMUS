const express = require('express')
const fs = require('fs')
const router = express.Router()
const trimRequest = require('trim-request')
import { buildErrObject, handleError } from '../../middlewares/utils'
import { upload } from '../../multer'
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const path = require('path')
import roleAuthorization from '../../controllers/auth/roleAuthorization'

import { getChunkInDocument, uploadFile, updateDocument, processDocument, deleteFile } from '../../controllers/document'
import enhance from '~/controllers/document/enhance'

// const directory = './src/storage'

router.get('/chunks', requireAuth, trimRequest.all, getChunkInDocument)

router.post('/upload', requireAuth, trimRequest.all, upload.single('file'), uploadFile)

router.patch('/', requireAuth, trimRequest.all, updateDocument)

router.post('/process', requireAuth, trimRequest.all, processDocument)
router.post('/enhance', requireAuth, trimRequest.all, enhance)

router.post(
  '/delete',
  requireAuth,
  roleAuthorization(['administrator', 'academic_administrator']),
  trimRequest.all,
  deleteFile
)

router.get('/', async (req, res) => {
  const filePath = path.join(process.cwd(), '/public/storage', `${req.query.name}`)
  try {
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf')
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)
    } else {
      throw buildErrObject(422, 'PDF file not found')
    }
  } catch (error) {
    handleError(res, error)
  }

})

module.exports = router