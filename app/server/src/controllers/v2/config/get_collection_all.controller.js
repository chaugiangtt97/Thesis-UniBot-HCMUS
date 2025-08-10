import { listCollections } from '~/config/milvus'
import { handleError } from '../../../middlewares/utils'

export const get_collections_all = async (req, res) => {
  try {
    res.status(200).json(await listCollections())
  } catch (error) {
    handleError(res, error)
  }
}

export default get_collections_all