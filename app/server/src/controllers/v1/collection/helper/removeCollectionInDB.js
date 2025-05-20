import Collection from '../../../../models/collection'
import { buildErrObject } from '../../../../middlewares/utils'
import { chatbotService } from '~/services/chatbot'

/**
 * Remove collection from database by id
 */
export const remove_collection_in_db = async (req) => {
  try {
    if (!req.body?.collection_id) throw buildErrObject(422, 'COLLECTION_ID_NOT_FOUND')

    await chatbotService ('PATCH', 'collection', [], { collection_name: req.body?.collection_id })
      .then(async () => await Collection.deleteOne({ _id: req.body?.collection_id }) )
      .catch((err) => { throw buildErrObject(422, err.message, 'Lỗi Ở Bước Xóa Collection' + err?.message) })

    // await Collection.deleteOne({ _id: req.body?.collection_id })

    return { message: 'Cập nhật thành công' }

  } catch (err) {
    throw buildErrObject(422, err.message)
  }


}

export default remove_collection_in_db