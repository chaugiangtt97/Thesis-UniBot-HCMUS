import { isIDGood, handleError } from '../../../middlewares/utils'
import { getUserByToken } from './helpers'

export const verifyToken = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const user_info = await getUserByToken(id)
    res.status(200).json(user_info)
  } catch (error) {
    handleError(res, error)
  }
}

export default verifyToken