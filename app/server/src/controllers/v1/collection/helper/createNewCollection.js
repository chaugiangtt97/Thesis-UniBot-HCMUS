import Collection from '../../../../models/collection'
import { buildErrObject } from '../../../../middlewares/utils'
import { chatbotService } from '~/services/chatbot'
const { ObjectId } = require('mongodb')
/**
 * Gets collection from database by id
 */
export const createNewCollection = async (req) => {
  try {
    if (!req.body?.name) throw buildErrObject(422, 'COLLECTION_LONG_NAME_NOT_FOUND')
    if (!req.body?.description) throw buildErrObject(422, 'COLLECTION_DESCRIPTION_NOT_FOUND')
    const id = new ObjectId()
    const collection_format = {
      _id: id,
      name: id,
      collection_name: req.body?.name,
      collection_description: req.body?.description,
      amount_document: 0,
      type: 'upload'
    }
    const collection = new Collection(collection_format)

    const res = await chatbotService ('POST', 'collection', [],
      { name: id.toString(),
        long_name: req.body?.name,
        description: req.body?.description,
        metadata: req.body?.metadata
      }).then(async () => {
      await collection.save()
        .catch((err) => { throw buildErrObject(422, err.message, 'Lỗi Ở Bước Save Collection' + err?.message) })
      return { message: 'Cập nhật thành công' }
    }).catch((e) => {
      throw e.message
    })

    return res
  } catch (err) {
    throw buildErrObject(422, err.message)
  }


}

export default createNewCollection