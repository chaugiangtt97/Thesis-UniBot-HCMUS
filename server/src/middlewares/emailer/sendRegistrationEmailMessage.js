const { prepareToSendEmail } = require('./prepareToSendEmail').default

/**
 * Sends registration email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendRegistrationEmailMessage = (user = {}) => {
  prepareToSendEmail(user)
}

module.exports = { sendRegistrationEmailMessage }
