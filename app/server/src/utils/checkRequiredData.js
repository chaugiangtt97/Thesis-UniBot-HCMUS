const { buildErrObject } = require('~/middlewares/utils')

export const checkRequiredData = (data, required_list = []) => {
  try {
    required_list.map((key) => {
      if (!data?.[key]) throw `Field ${key} is missing!`
    })
  } catch (e) {
    throw buildErrObject(404, 'CHAT_SESSION.MISSING_FIELD', `Required field - ${e}`)
  }
}

export default checkRequiredData