import { handleError, buildErrObject } from '../../middlewares/utils'
import { useKHTN_Chatbot } from '../../apis/KHTN_Chatbot'

import Collection from '../../models/collection'

export const getCollectionSchema = async (req, res) => {
  try {
    const chatbot = useKHTN_Chatbot()

    const collection = await Collection.findById(req.query._id)
      .then((collection) => collection)
      .catch(() => { throw buildErrObject(404, 'CAN NOT CONNECT TO DATABASE') })

    const schema = await chatbot.get_collection_schema(collection.name)
      .catch(() => { throw buildErrObject(404, 'CAN_NOT_GET_SCHEMA') })

    res.status(200).json(schema)
  } catch (error) {
    handleError(res, error)
  }
}

export default getCollectionSchema