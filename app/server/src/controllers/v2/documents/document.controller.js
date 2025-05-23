import { buildErrObject, handleError, isIDGood } from '~/middlewares/utils'
import { update_document_in_db } from './helpers/update_document_in_db'
import { create_document_in_db } from './helpers/create_document_in_db'
import { delete_document_in_db } from './helpers/delete_document_in_db'
import { get_document_from_db } from './helpers/get_document_from_db'
import checkRequiredData from '~/utils/checkRequiredData'

export const get_document = async (req, res) => {
  try {
    checkRequiredData(req.query, ['collection_name'], 'DOCUMENT.MISSING_VALUE')
    const collection_name = req.query.collection_name
    res.status(200).json(await get_document_from_db(collection_name))
  } catch (error) {
    handleError(res, error)
  }
}

export const delete_document = async (req, res) => {
  try {
    const usr_id = await isIDGood(req.user._id)

    if (!usr_id)
      throw buildErrObject(404, 'CHAT_COLLECTION.DOCUMENT.ID_NOT_FOUND', 'user id not found!')

    res.status(200).json(await delete_document_in_db())
  } catch (error) {
    handleError(res, error)
  }
}

export const create_new_document = async (req, res) => {
  try {
    const usr_id = await isIDGood(req.user._id)

    if (!usr_id)
      throw buildErrObject(404, 'CHAT_COLLECTION.DOCUMENT.ID_NOT_FOUND', 'user id not found!')

    res.status(200).json(await create_document_in_db())
  } catch (error) {
    handleError(res, error)
  }
}

export const update_document = async (req, res) => {
  try {
    const usr_id = await isIDGood(req.user._id)

    if (!usr_id)
      throw buildErrObject(404, 'CHAT_COLLECTION.DOCUMENT.ID_NOT_FOUND', 'user id not found!')

    res.status(200).json(await update_document_in_db())
  } catch (error) {
    handleError(res, error)
  }
}
