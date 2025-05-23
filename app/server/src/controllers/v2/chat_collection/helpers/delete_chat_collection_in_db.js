const { useKHTN_Chatbot } = require('../../../../apis/apiRoute')
const { buildErrObject } = require('../../../../middlewares/utils')
const Collection = require('../../../../models/collection')
/**
 * Gets collection schema from database by id
 * @param _id chat collection id
 */
export const delete_chat_collection_in_db = async (collection_name = null) => {
  try {
    if (!collection_name) throw buildErrObject(422, 'COLLECTION_ID_NOT_FOUND')

    await useKHTN_Chatbot.delete_chat_collection(collection_name)
      .catch(() => { throw buildErrObject(404, 'CAN_NOT_DELETE_COLLECTION') })

    await Collection.deleteOne({ collection_name: collection_name })

    return { message: 'Cập nhật thành công' }

  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export default delete_chat_collection_in_db