import getKeyAPI_Service from '../../controllers/v1/config/helper/getKeyAPI_Service'
import { buildErrObject } from '../utils'

const nodemailer = require('nodemailer')

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
export const sendEmail = async (data = {}, callback) => {
  try {
    const email_config = (await getKeyAPI_Service('SMTP_EMAIL')).configs

    if (!email_config) {
      callback(false)
      throw buildErrObject(404, 'MIDDLEWARE.EMAILER.CONFIGS_NOT_FOUND', 'Configs cannot be found')
    }

    const transporter = nodemailer.createTransport({
      service: email_config.provider,
      auth: {
        user:  email_config.email_address, // process.env.EMAIL_ADDRESS,
        pass:  email_config.email_password // process.env.EMAIL_PASSWORD
      }
    })
    const mailOptions = {
      from: `Dự án UniBot tư vấn <${email_config.email_address}>`,
      to: `${data.user.name} <${data.user.email}>`,
      subject: data.subject,
      html: data.htmlMessage
    }
    process.env.NODE_ENV == 'production' && transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return callback(false)
      }
      return callback(true)
    })
  } catch (e) {
    callback(false)
    throw buildErrObject(404, 'MIDDLEWARE.EMAILER.CONFIGS_NOT_FOUND', 'Configs cannot be found')
  }

}

export default sendEmail
