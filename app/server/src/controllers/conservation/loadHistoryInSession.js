import { handleError, isIDGood } from '../../middlewares/utils'
import { getHistoryByChatSessionID } from './helper/getHistoryByChatSessionID'

export const loadHistoryInSession = async (req, res) => {
  try {
    const id = await isIDGood(req.body.session)
    res.status(200).json(await getHistoryByChatSessionID(req.user, id))
  } catch (error) {
    handleError(res, error)
  }
}

export default loadHistoryInSession