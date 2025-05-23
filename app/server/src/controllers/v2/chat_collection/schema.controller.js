import { handleError } from '~/middlewares/utils'
import checkRequiredData from '~/utils/checkRequiredData'

const { default: get_collection_schema } = require('./helpers/get_collection_schema')

export const get_schema = async (req, res) => {
  try {
    checkRequiredData(req.body, ['chat_collection_name'], 'ChAT_COLLECTION.SCHEMA.MISSING_FIELD')
    const { chat_collection_name } = req.body

    res.status(200).json(await get_collection_schema(chat_collection_name))
  } catch (error) {
    handleError(res, error)
  }
}

export default get_schema