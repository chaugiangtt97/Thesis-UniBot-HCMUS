/* eslint-disable no-console */
import { buildErrObject } from '../utils'
import { sendEmail } from './sendEmail'
const fs = require('fs')
const path = require('path')
/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = (user = {}, code = 'VERIFY_EMAIL') => {
  try {
    let resource = null
    switch (code) {
      case 'FORGOT_PASSWORD':
        resource = './template/verification_email.html'
        break
      case 'VERIFY_EMAIL':
        resource = './template/verification_to_reset_password.html'
        break
      default:
        throw buildErrObject(404, 'MIDDLEWARE.EMAILER.INVALID_CODE', 'Invalid code')
    }

    let htmlTemplate = fs.readFileSync(path.join(__dirname, resource), 'utf-8')
    const cssStyles = fs.readFileSync(path.join(__dirname, './template/email_styles.css'), 'utf-8')

    console.log(user)
    if (!user?.name || !user?.verification || !user?.email) {
      throw buildErrObject(404, 'MIDDLEWARE.EMAILER.DATA_USER_NOT_FOUND', '')
    }
    htmlTemplate = htmlTemplate
      .replace('/* STYLE_PLACEHOLDER */', cssStyles)
      .replace('<!--NAME-->', user?.name)
      .replace('<!--VERIFICATION-->', user?.verification)

    const data = {
      user,
      subject: 'Dự án Chatbot tư vấn FIT-HCMUS',
      htmlMessage: htmlTemplate
    }

    sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`)
    )
  } catch (e) {
    throw buildErrObject(404, 'MIDDLEWARE.EMAILER.ERR_SEND_EMAIL', e)
  }
}

export default { prepareToSendEmail }
