import { handleError, isIDGood } from '../../middlewares/utils'
import { saveNewDocumentToDB } from './helper/saveNewDocumentToDB'

export const updateDocument = async (req, res) => {
  try {
    const id = await isIDGood(req.body.id)
    res.status(200).json(await saveNewDocumentToDB(id, req.body.update))
  } catch (error) {
    handleError(res, error)
  }
}

export default updateDocument