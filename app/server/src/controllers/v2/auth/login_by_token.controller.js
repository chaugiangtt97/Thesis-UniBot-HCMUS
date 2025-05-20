import { isIDGood, handleError } from '../../../middlewares/utils'
import getUserByToken from './helpers/getUserByToken'

export const login_by_token = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)

    const user_info = await getUserByToken(id)
    res.status(200).json(user_info)
  } catch (error) {
    handleError(res, error)
  }
}

export default login_by_token