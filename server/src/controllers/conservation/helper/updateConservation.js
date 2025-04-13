import { buildErrObject } from '../../../middlewares/utils'

import History from '../../../models/history'

export const updateConservation = async (id = null, data = null) => {
  try {
    const result = await History.findByIdAndUpdate(id, data, { new: true }).then(async (_doc) => {
      if (!_doc) buildErrObject(422, 'NOT_FOUND')
      return _doc
    }).catch((err) => {
      throw buildErrObject(422, err.message)
    })
    return result
  } catch (error) {
    return error
  }
}

export default updateConservation