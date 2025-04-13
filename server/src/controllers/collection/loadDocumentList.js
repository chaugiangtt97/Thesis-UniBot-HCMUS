import { handleError, isIDGood } from '../../middlewares/utils'
import { getDocumentByCollectionID } from './helper/getDocumentByCollectionID'

export const loadDocumentList = async (req, res) => {
  try {
    const id = await isIDGood(req.query.collection_id)
    res.status(200).json(await getDocumentByCollectionID(id))
  } catch (error) {
    handleError(res, error)
  }
}

export default loadDocumentList