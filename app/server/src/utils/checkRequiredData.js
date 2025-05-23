const { buildErrObject } = require('~/middlewares/utils')

export const checkRequiredData = (data, required_list = [], messsage_err = 'MISSING_FIELD') => {
  try {
    required_list.map((key) => {
      if (!data?.[key]) throw `Field ${key} is missing!`
    })
  } catch (e) {
    throw buildErrObject(404, messsage_err, `Required field - ${e}`)
  }
}

export default checkRequiredData