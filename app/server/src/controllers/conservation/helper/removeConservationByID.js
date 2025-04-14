import Chat_session from '../../../models/chat_session'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - session id
 */
export const removeConservationByID = async ( user = '', id = '' ) => {

  const result = await Chat_session.findOneAndDelete({
    _id: id,
    owner: user._id
  }).then((session) => {
    if (!session) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return session
  }).catch((err) => {
    throw buildErrObject(422, err.message)
  })

  return result
}

export default removeConservationByID