import getKeyAPI_Service from '../../controllers/config/helper/getKeyAPI_Service'

const nodemailer = require('nodemailer')

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
export const sendEmail = async (data = {}, callback) => {

  const email_config = await getKeyAPI_Service('SMTP_EMAIL')?.configs
  if (!email_config) {
    return callback(false)
  }
  const transporter = nodemailer.createTransport({
    service: email_config.provider,
    auth: {
      user:  email_config.email_address, // process.env.EMAIL_ADDRESS,
      pass:  email_config.email_password // process.env.EMAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: `UniBot-KHTN (2024) <${email_config.email_address}>`,
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
}

export default sendEmail
