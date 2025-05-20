import { handleError } from '../../../middlewares/utils'
import remove_collection_in_db from './helper/removeCollectionInDB'

export const remove_collection = async (req, res) => {
  try {
    res.status(200).json(await remove_collection_in_db(req))
  } catch (error) {
    handleError(res, error)
  }
}

export default remove_collection