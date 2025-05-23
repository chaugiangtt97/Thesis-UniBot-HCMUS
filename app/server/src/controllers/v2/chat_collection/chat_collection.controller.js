import { buildErrObject, handleError, isIDGood } from '~/middlewares/utils'
import get_chat_collection_from_db from './helpers/get_chat_collection_from_db'
import create_chat_collection_in_db from './helpers/create_chat_collection_in_db'
import checkRequiredData from '~/utils/checkRequiredData'
import delete_chat_collection_in_db from './helpers/delete_chat_collection_in_db'

export const get_chat_collection = async (req, res) => {
  try {
    const usr_id = await isIDGood(req.user._id)

    if (!usr_id)
      throw buildErrObject(404, 'CHAT_COLLECTION.ID_NOT_FOUND', 'user id not found!')

    res.status(200).json(await get_chat_collection_from_db())
  } catch (error) {
    handleError(res, error)
  }
}

export const create_chat_collection = async (req, res) => {
  try {
    checkRequiredData(req.body, ['long_name', 'description', 'metadata'], 'ChAT_COLLECTION.MISSING_FIELD')
    const { long_name, description, metadata } = req.body

    res.status(200).json(await create_chat_collection_in_db(long_name, description, metadata))
  } catch (error) {
    handleError(res, error)
  }
}

export const delete_chat_collection = async (req, res) => {
  try {
    checkRequiredData(req.body, ['collection_name'], 'ChAT_COLLECTION.MISSING_FIELD')
    const { collection_name } = req.body

    res.status(200).json(await delete_chat_collection_in_db(collection_name))
  } catch (error) {
    handleError(res, error)
  }
}