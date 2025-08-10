import { handleError } from '../../../middlewares/utils'
import get_key_api from '../auth/helpers/get_key_api'

export const get_captcha_token = async (req, res) => {
  try {
    res.status(200).json(await get_key_api('RECAPTCHA'))
  } catch (error) {
    handleError(res, error)
  }
}

export default get_captcha_token