import { handleError, isIDGood } from '../../../middlewares/utils'
import { getConservationFromDB } from './helper/getConservationFromDB'

export const loadConservationList = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    res.status(200).json(await getConservationFromDB(id))
  } catch (error) {
    handleError(res, error)
  }
}

export default loadConservationList