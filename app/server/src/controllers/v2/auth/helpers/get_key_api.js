import { buildErrObject } from '../../../../middlewares/utils'
import Api_Configurations from '../../../../models/api_configurations'

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
export const get_key_api = async (code, user = null) => {

  const public_config = ['RECAPTCHA']

  if (!public_config.includes(code) && user && user?.educationRole == 'student' )
    throw buildErrObject(404, 'CONFIG.SERVICE_NOT_ACCESS', 'Do not access to service configs')

  return Api_Configurations.findOne({ code }, 'service configs updated_at')
    .then(async (result) => {
      if (!result) {
        throw buildErrObject(404, 'CONFIG.SERVICE_NOT_FOUND', 'Service configs not found')
      }
      if (code == 'RECAPTCHA') {
        result = result.toObject()
        return { key: result?.configs?.RECAPTCHA_SITE_KEY }
      }
      return result
    }).catch(async (err) => {
      throw buildErrObject(422, err.message)
    })
}

export default get_key_api
