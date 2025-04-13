import { handleError } from '../../middlewares/utils'
import { enhanceDocumentAPI } from './helper/enhanceDocumentAPI'

export const enhance = async (req, res) => {
  try {
    const id = req.body?.id
    res.status(200).json(await enhanceDocumentAPI(id, req))
  } catch (error) {
    handleError(res, error)
  }
}

export default enhance