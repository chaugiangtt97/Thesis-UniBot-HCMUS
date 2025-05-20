import { handleError, isIDGood } from '../../../middlewares/utils'
import { deleteDocumentAndUpdateCollection } from './helper/deleteDocumentAndUpdateCollection'

export const deleteFile = async (req, res) => {
  try {
    const id = req.body?.id
    res.status(200).json(await deleteDocumentAndUpdateCollection(id))
  } catch (error) {
    handleError(res, error)
  }
}

export default deleteFile