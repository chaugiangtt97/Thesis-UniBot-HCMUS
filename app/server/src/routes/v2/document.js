const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })

import uploadFile from '~/controllers/v2/documents/helpers/updateFile'
import { upload } from '../../multer'
import path from 'path'
const fs = require('fs')
import { buildErrObject, handleError } from '~/middlewares/utils'

const { get_document } = require('~/controllers/v2/documents/document.controller')

router.get('/', trimRequest.all, get_document)

router.post('/upload', requireAuth, trimRequest.all, upload.single('file'), uploadFile)

router.get('/get-file', async (req, res) => {
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
