import { buildErrObject } from '../../../../middlewares/utils'
import Api_Configurations from '../../../../models/api_configurations'

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
export const getKeyAPI_Service = async (code) => {
  if (['RECAPTCHA'].includes(code))
    return Api_Configurations.findOne({ code }, 'service configs updated_at')
      .then(async (result) => {
        if (!result) {
          throw buildErrObject(404, 'SERVICE_NOT_FOUND')
        }
        if (code == 'RECAPTCHA') {
          result = result.toObject()
          return { key: result?.configs?.RECAPTCHA_SITE_KEY }
        }
        return result
      }).catch(async (err) => {
        throw buildErrObject(422, err.message)
      })
  return { key: 'NOT_FOUND' }
}

export default getKeyAPI_Service
