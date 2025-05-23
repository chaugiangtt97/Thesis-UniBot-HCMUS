import { useKHTN_Chatbot } from '~/apis/apiRoute'
import { buildErrObject } from '../../../../middlewares/utils'
import Collection from '../../../../models/collection'

export const get_chat_collection_from_db = async () => {
  try {
    const get_collection_result = await useKHTN_Chatbot.get_chat_collection()
      .catch(() => { throw buildErrObject(404, 'CAN_NOT_DELETE_COLLECTION') })

    return await Collection.find({
      collection_name: { $in: get_collection_result.list_collections }
    }).sort({ createdAt: -1 }).then((collections) => {
      return collections.map((collection) => {
        const collection_detail = get_collection_result.details
        return {
          ...collection._doc,
          ...collection_detail[collection.collection_name]
        }
      })
    }).catch((err) => {
      throw buildErrObject(422, 'CHAT_COLLECTION.ERR_GET_network', err)
    })
  } catch (err) {
    throw buildErrObject(422, 'CHAT_COLLECTION.ERR_GET', err)
  }
}

export default get_chat_collection_from_db