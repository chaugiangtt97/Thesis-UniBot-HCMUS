const { getProfileFromDB } = require('./getProfileFromDB')
const { getUserByToken } = require('./getUserByToken')
const { updateProfileInDB } = require('./updateProfileInDB')
const { getDataToDashboard } = require('./getDataToDashboard')

module.exports = {
  getProfileFromDB,
  updateProfileInDB,
  getUserByToken,
  getDataToDashboard
}
