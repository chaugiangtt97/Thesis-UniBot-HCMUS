const { getProfileFromDB } = require('./getProfileFromDB')
const { getUserByToken } = require('../../../v2/auth/helpers/getUserByToken')
const { updateProfileInDB } = require('./updateProfileInDB')
const { getDataToDashboard } = require('./getDataToDashboard')

module.exports = {
  getProfileFromDB,
  updateProfileInDB,
  getUserByToken,
  getDataToDashboard
}
