/* eslint-disable no-console */
import { buildErrObject } from '../../../../middlewares/utils'
export const reCAPTCHA = async (captchaToken = null) => {
  try {
    const secretKey = process.env?.RECAPTCHA_SECRET_KEY || null
    if (!secretKey || !captchaToken) {
      throw 'secretKey or captchaToken must be required!'
    }
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`

    const node_env = process.env?.NODE_ENV ||'development'

    const response = await fetch(url, { method: 'POST' })
    const data = await response.json()

    // eslint-disable-next-line no-console
    node_env == 'development' && console.log('Captcha response:', data)

    if (data.success) return true

    return false

  } catch (error) {
    throw buildErrObject(422, 'AUTH.RECAPTCHA_FAILED', error)
  }
}

export default reCAPTCHA
