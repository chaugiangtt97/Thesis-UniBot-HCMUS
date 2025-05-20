import { handleError } from '../../../middlewares/utils'
import { updateConservation } from './helper/updateConservation'

export const updateConservationInDB = async (req, res) => {
  try {
    res.status(200).json(await updateConservation(req.body._id, req.body))
  } catch (error) {
    handleError(res, error)
  }
}

export default updateConservationInDB