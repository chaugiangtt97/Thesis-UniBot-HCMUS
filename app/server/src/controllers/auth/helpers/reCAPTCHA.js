/* eslint-disable no-console */
export const reCAPTCHA = async (captchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`
  const node_env = process.env.NODE_ENV
  try {
    const response = await fetch(url, {
      method: 'POST'
    })
    const data = await response.json()

    // eslint-disable-next-line no-console
    console.log('Captcha response:', data)

    if (data.success) {
      node_env == 'development' && console.log('Captcha verification successful')
      return true
    } else {
      node_env == 'development' && console.log('Captcha verification successful')
      return false
    }
  } catch (error) {
    return false
  }
}

export default reCAPTCHA
