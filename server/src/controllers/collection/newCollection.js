import { handleError } from '../../middlewares/utils'
import createNewCollection from './helper/createNewCollection'

export const new_collection = async (req, res) => {
  try {
    res.status(200).json(await createNewCollection(req))
  } catch (error) {
    handleError(res, error)
  }
}

export default new_collection