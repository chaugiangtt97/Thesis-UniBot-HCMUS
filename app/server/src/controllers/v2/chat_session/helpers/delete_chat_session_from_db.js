import Chat_session from '../../../../models/chat_session'
import { buildErrObject } from '../../../../middlewares/utils'

export const delete_chat_session_from_db = async ( user_id = '', chat_session_id = '' ) => {
  return await Chat_session.findOneAndDelete({ _id: chat_session_id, owner: user_id })
    .then((chat_session) => {
      if (!chat_session) throw buildErrObject(422, 'CHAT_SESSION.CHAT_SESSSION_NOT_FOUND', 'Chat sessions were not founded in database')
      return chat_session
    }).catch((err) => {
      throw buildErrObject(422, 'CHAT_SESSION.ERR_CREATE', err)
    })
}

export default delete_chat_session_from_db