const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

const { default: get_captcha_token, default: get_collections_all } = require('../../controllers/v2/config/get_collection_all.controller')


// // 🧩 Captcha / Cấu hình frontend
router.get('/captcha', trimRequest.all, get_captcha_token)

router.get('/collections', trimRequest.all, get_collections_all)

module.exports = router