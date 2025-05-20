import Chat_session from '../../../../models/chat_session'
import { buildErrObject } from '../../../../middlewares/utils'

export const update_chat_session_from_db = async ( chat_session_onwer_id = '', chat_session_id = '', data ) => {
  return await Chat_session.findOneAndUpdate({ _id: chat_session_id, owner: chat_session_onwer_id }, data, { new: true })
    .then(async (_doc) => {
      if (!_doc) return buildErrObject(422, 'CHAT_SESSION.CHAT_SESSSION_NOT_FOUND', 'Chat sessions were not founded in database')
      return _doc
    }).catch((err) => {
      throw buildErrObject(422, 'CHAT_SESSION.ERR_UPDATE', err)
    })
}

export default update_chat_session_from_db