import { buildErrObject } from '../../../middlewares/utils'
import Api_Configurations from '../../../models/api_configurations'
/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
export const getKeyAPI_Service = async (code) => {
  if (code == 'GET_ALL') {
    return Api_Configurations.find({}, 'service config updated_at')
      .catch(async (err) => {
        throw buildErrObject(422, err.message)
      })
  }

  return Api_Configurations.findOne({ code }, 'service config updated_at').then(async (result) => {
    if (!result) {
      throw buildErrObject(404, 'SERVICE_NOT_FOUND')
    }
    return result
  }).catch(async (err) => {
    throw buildErrObject(422, err.message)
  })
}

export default getKeyAPI_Service
