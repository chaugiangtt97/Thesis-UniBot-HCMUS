import { handleError, isIDGood } from '../../middlewares/utils'
import { createFeedback } from './helpers'

export const feedback = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    res.status(200).json(await createFeedback(req, id))
  } catch (error) {
    handleError(res, error)
  }
}

export default feedback