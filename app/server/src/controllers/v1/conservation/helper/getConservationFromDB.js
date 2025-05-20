import Chat_session from '../../../../models/chat_session'
import { buildErrObject } from '../../../../middlewares/utils'

/**
 * Gets conservation from database by id
 * @param {string} id - session id
 */
export const getConservationFromDB = async (id = '') => {

  const result = await Chat_session.find({
    owner: id
  }, '-owner').sort({ createdAt: -1 }).then((conservation) => {
    if (!conservation) {
      return buildErrObject(422, 'NOT_FOUND')
    }
    return conservation
  }).catch((err) => {
    throw buildErrObject(422, err.message)
  })

  return result
}

export default getConservationFromDB