import { handleError, isIDGood } from '../../../middlewares/utils'
import { removeConservationByID } from './helper/removeConservationByID'

export const removeConservationInDB = async (req, res) => {
  try {
    const id = await isIDGood(req.body.session)
    res.status(200).json(await removeConservationByID(req.user, id))
  } catch (error) {
    handleError(res, error)
  }
}

export default removeConservationInDB