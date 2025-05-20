const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

const { default: get_captcha_token } = require('../../controllers/v2/config/get_captcha_token.controller')


// // 🧩 Captcha / Cấu hình frontend
router.get('/captcha', trimRequest.all, get_captcha_token)

module.exports = router