import { handleError, isIDGood } from '../../../middlewares/utils'
import { getChunkFromdbByDocumentID } from './helper/getChunkFromdbByDocumentID'

export const getChunkInDocument = async (req, res) => {
  try {
    const id = await isIDGood(req.query._id)
    res.status(200).json(await getChunkFromdbByDocumentID(id))
  } catch (error) {
    handleError(res, error)
  }
}

export default getChunkInDocument