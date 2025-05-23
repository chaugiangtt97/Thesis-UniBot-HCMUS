import Collection from '../../../../models/collection'
import { buildErrObject } from '../../../../middlewares/utils'
import { useKHTN_Chatbot } from '~/apis/apiRoute'
// import { chatbotService } from '~/services/chatbot'
// import { useKHTN_Chatbot } from '~/apis/KHTN_Chatbot'
const { ObjectId } = require('mongodb')
/**
 * Gets collection from database by id
 * @param name chat collection name
 * @param description chat collection description
 * @param metadata chat collection metadata
 */
export const create_chat_collection_in_db = async (long_name = null, description = null, metadata = []) => {
  try {
    if (!long_name) throw buildErrObject(422, 'CHAT_COLLECTION.NOT_FOUND', 'collection name not found')
    if (!description) throw buildErrObject(422, 'CHAT_COLLECTION.NOT_FOUND', 'collection description not found')

    const id = new ObjectId()
    const collection_format = {
      _id: id,
      collection_name: `_${id}`,
      long_name: long_name,
      description: description,
      type: 'upload'
    }
    const collection = new Collection(collection_format)

    await useKHTN_Chatbot.create_chat_collection(`_${id}`, long_name, description, metadata)

    try {
      return await collection.save().then((newCollection) => newCollection || {})
    } catch (err) {
      await useKHTN_Chatbot.delete_chat_collection(`_${id}`)
      throw buildErrObject(422, 'CHAT_COLLECCTION.ERR_CREATE', err)
    }

  } catch (err) {
    throw buildErrObject(422, 'CHAT_COLLECCTION.ERR_CREATE', err)
  }
}

export default create_chat_collection_in_db