import { buildErrObject } from '../../../../middlewares/utils'

import History from '../../../../models/history'

export const saveConservationToDB = async (conservation = {}) => {
  const history = new History({
    _id: conservation._id,
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

  const result = await history.save().then(async (data) => {
    return data
  }).catch((err) => {
    return buildErrObject(422, err.message)
  })

  return result
}

export default saveConservationToDB