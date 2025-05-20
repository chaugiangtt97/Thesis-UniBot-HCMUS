import History from '../../../../models/history'
import Chat_Session from '../../../../models/chat_session'
import { buildErrObject } from '../../../../middlewares/utils'

export const get_history_from_db = async (user_id = null, chat_session_id = null, history_id = null) => {
  if (!history_id && !chat_session_id)
    throw buildErrObject(422, 'CHAT_SESSION.HISTORY.INVALID_VALUE', 'history_id or chat_session_id must be valid')

  if (chat_session_id)
    return await History
      .find({ sender: user_id, session_id: chat_session_id }, '-sender')
      .sort({ createdAt: 1 })
      .then(async (history) => {
        if (!history) {
          throw buildErrObject(422, 'CHAT_SESSION.HISTORY.NOT_FOUND', 'Can not find history by user_id and chat_session_id')
        }
        const session = await Chat_Session.findById(chat_session_id)
        return { ...session._doc, history }
      }).catch((err) => {
        throw buildErrObject(422, 'CHAT_SESSION.HISTORY.ERR_GET_BY_SESSION_ID', err)
      })

  return await History
    .find({ _id: history_id }, '-sender')
    .sort({ createdAt: 1 })
    .catch((err) => {
      throw buildErrObject(422, 'CHAT_SESSION.HISTORY.ERR_GET_BY_ID', err)
    })

}

export default get_history_from_db