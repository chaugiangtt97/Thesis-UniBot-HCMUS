const nodemailer = require('nodemailer')

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
export const sendEmail = async (data = {}, callback) => {

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
  process.env.NODE_ENV == 'production' && transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return callback(false)
    }
    return callback(true)
  })
}

export default sendEmail
