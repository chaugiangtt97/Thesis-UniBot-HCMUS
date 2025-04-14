const nodemailer = require('nodemailer')

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
export const sendEmail = async (data = {}, callback) => {
  // const auth = {
  //   auth: {
  //     // eslint-disable-next-line camelcase
  //     api_key: process.env.EMAIL_SMTP_API_MAILGUN,
  //     domain: process.env.EMAIL_SMTP_DOMAIN_MAILGUN
  //   }
  //   // host: 'api.eu.mailgun.net' // THIS IS NEEDED WHEN USING EUROPEAN SERVERS
  // }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: `UniBot-KHTN (2024) <${process.env.EMAIL_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage
  }
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return callback(false)
    }
    return callback(true)
  })
}

export default sendEmail
