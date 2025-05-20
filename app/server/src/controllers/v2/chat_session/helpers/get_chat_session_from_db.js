import Chat_session from '../../../../models/chat_session'
import { buildErrObject } from '../../../../middlewares/utils'

export const get_chat_session_from_db = async ( chat_session_owner_id = '') => {
  return await Chat_session.find({ owner: chat_session_owner_id }, '-owner')
    .sort({ createdAt: -1 }).then((chat_session) => {
      if (!chat_session) throw buildErrObject(422, 'CHAT_SESSION.CHAT_SESSSION_NOT_FOUND', 'Chat sessions were not founded in database')
      return chat_session
    }).catch((err) => {
      throw buildErrObject(422, 'CHAT_SESSION.ERR_GET', err)
    })
}

export default get_chat_session_from_db