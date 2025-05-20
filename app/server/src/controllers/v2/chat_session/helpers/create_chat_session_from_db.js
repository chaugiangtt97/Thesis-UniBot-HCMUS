import { buildErrObject } from '../../../../middlewares/utils'

import ChatSession from '../../../../models/chat_session'

export const create_chat_session_from_db = async ( session_name = null, session_description = null, chat_session_onwer_id = null ) => {

  const chat_session_object = new ChatSession({
    owner: chat_session_onwer_id,
    session_name: session_name,
    session_description: session_description,
    amount_question: 0
  })

  return await chat_session_object.save().then((chat_session) => {
    return {
      _id: chat_session._id,
      createdAt: chat_session.createdAt,
      updatedAt: chat_session.updatedAt,
      session_description: chat_session.session_description,
      session_name: chat_session.session_name,
      amount_question: chat_session.amount_question
    }
  }).catch((err) => {
    throw buildErrObject(500, 'CHAT_SESSION.ERR_CREATE', err)
  })
}

export default create_chat_session_from_db