import { handleError, isIDGood } from '../../middlewares/utils'
import { createSessionAndReturnSession } from './helper/createSessionAndReturnSession'

export const newChat = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    res.status(200).json(await createSessionAndReturnSession(req, id))
  } catch (error) {
    handleError(res, error)
  }
}

export default newChat