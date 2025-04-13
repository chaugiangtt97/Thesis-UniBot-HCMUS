import { handleError, isIDGood } from '../../middlewares/utils'
import { processDocumentHelper } from './helper/processDocument'

export const processDocument = async (req, res) => {
  try {
    const id = await isIDGood(req.body.id)
    res.status(200).json(await processDocumentHelper(id, req.body.chunks))
  } catch (error) {
    handleError(res, error)
  }
}

export default processDocument