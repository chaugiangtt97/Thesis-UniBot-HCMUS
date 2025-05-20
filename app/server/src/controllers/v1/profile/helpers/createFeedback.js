import Feedback from '../../../../models/feedbacks'

export const createFeedback = async (res = {}, usr_id = null ) => {

  const session = new Feedback({
    owner: usr_id,
    message: res.body.message
  })

  const feedback = await session.save().then((feedback) => {
    return feedback
  }).catch((err) => {
    throw new Error(err)
  })

  return feedback
}

export default createFeedback