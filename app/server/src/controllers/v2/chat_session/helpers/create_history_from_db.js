import { buildErrObject } from '../../../../middlewares/utils'
import History from '../../../../models/history'

export const create_history_from_db = async (conservation = {}) => {
  try {
    const history = new History({
      sender : conservation.sender,
      session_id: conservation.session_id,
      question : conservation.question,
      anwser: conservation.anwser,
      duration: conservation.duration,
      source: conservation.source,
      rating: conservation.rating,
      state: conservation.state,
      resource: conservation?.resource
    })

    return await history.save()
      .catch((err) => {
        throw buildErrObject(422, 'CHAT_SESSION.HISTORY.ERR_CREATE', err)
      })
  } catch (err) {
    throw buildErrObject(422, 'CHAT_SESSION.HISTORY.ERR_INVALID_VALUE', err)
  }

}