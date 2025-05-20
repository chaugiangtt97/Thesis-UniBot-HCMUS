import Session from '../../../../models/chat_session'

export const createSessionAndReturnSession = async (res = {}, usr_id = null ) => {

  const session = new Session({
    owner: usr_id,
    session_name: res.body.name,
    session_description: res.body.description,
    amount_question: 0
  })

  const chat_session = await session.save().then((chat_session) => {
    return {
      _id: chat_session._id,
      createdAt: chat_session.createdAt,
      updatedAt: chat_session.updatedAt,
      session_description: chat_session.session_description,
      session_name: chat_session.session_name,
      amount_question: chat_session.amount_question
    }
  }).catch((err) => {
    throw new Error(err)
  })

  return chat_session
}

export default createSessionAndReturnSession