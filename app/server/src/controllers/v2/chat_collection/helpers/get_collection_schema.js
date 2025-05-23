const { useKHTN_Chatbot } = require('../../../../apis/apiRoute')
const { buildErrObject } = require('../../../../middlewares/utils')
const Collection = require('../../../../models/collection')
/**
 * Gets collection schema from database by id
 * @param _id chat collection id
 */
export const get_collection_schema = async (_id = null) => {
  try {
    if (!_id) {
      throw 'CHAT_COLLECTION.NOT_FOUND'
    }

    const collection = await Collection.findById(_id)
      .then((collection) => {
        if (!collection) throw buildErrObject(404, 'CHAT_COLLECTION.NOT_FOUND', '')
        return collection
      })
      .catch((e) => { throw buildErrObject(404, 'CHAT_COLLECTION.ERR', e) })

    return await useKHTN_Chatbot.get_chat_collection_schema(collection.name)
      .catch(() => { throw buildErrObject(404, 'CAN_NOT_GET_SCHEMA') })
  } catch (error) {
    throw buildErrObject(404, 'CAN_NOT_GET_SCHEMA')
  }
}

export default get_collection_schema