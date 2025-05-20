import { buildErrObject } from '../../../../middlewares/utils'

import History from '../../../../models/history'

export const update_history_from_db = async (user_id, history_id = null, data = null) => {
  if (user_id == null)
    throw buildErrObject(422, 'CHAT_SESSION.HISTORY.USER_NOT_ACCESS', 'user not access to update')
  return await History.findByIdAndUpdate( history_id, data, { new: true })
    .then(async (history) => {
      if (!history)
        throw buildErrObject(422, 'HISTORY_NOT_FOUND', 'History id were not founded in database')
      return history
    }).catch((err) => {
      throw buildErrObject(422, 'CHAT_SESSION.HISTORY.ERR_UPDATE', err)
    })
}

export default update_history_from_db