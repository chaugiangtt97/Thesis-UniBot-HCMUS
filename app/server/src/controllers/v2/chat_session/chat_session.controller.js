import checkRequiredData from '~/utils/checkRequiredData'
import { buildErrObject, handleError, isIDGood } from '../../../middlewares/utils'
import create_chat_session_from_db from './helpers/create_chat_session_from_db'
import delete_chat_session_from_db from './helpers/delete_chat_session_from_db'
import get_chat_session_from_db from './helpers/get_chat_session_from_db'
import update_chat_session_from_db from './helpers/update_chat_session_from_db'

export const get_chat_session = async (req, res) => {
  try {
    const usr_id = await isIDGood(req.user._id)
    res.status(200).json(await get_chat_session_from_db(usr_id))
  } catch (error) {
    handleError(res, error)
  }
}

export const update_chat_session = async (req, res) => {
  try {
    checkRequiredData(req.body, ['chat_session_id', 'dataUpdate'], 'CHAT_SESSSION.MISSING_FIELD')

    const chat_session_onwer_id = await isIDGood(req.user._id)
    const chat_session_id = await isIDGood(req.body?.chat_session_id)
    const dataUpdate = req.body?.dataUpdate

    if (dataUpdate == {})
      throw buildErrObject(404, 'CHAT_SESSION.INVALID_DATA_UPDATE', 'dataUpdate is empty')

    res.status(200).json(await update_chat_session_from_db(chat_session_onwer_id, chat_session_id, dataUpdate))
  } catch (error) {
    handleError(res, error)
  }
}

export const create_chat_session = async (req, res) => {
  try {
    checkRequiredData(req.body, ['chat_session_name', 'chat_session_description'], 'CHAT_SESSSION.MISSING_FIELD')

    const chat_session_onwer_id = await isIDGood(req.user._id)
    const chat_session_name = req.body?.chat_session_name
    const chat_session_description = req.body?.chat_session_description

    res.status(200).json(await create_chat_session_from_db(chat_session_name, chat_session_description, chat_session_onwer_id))
  } catch (error) {
    handleError(res, error)
  }
}

export const delete_chat_session = async (req, res) => {
  try {
    const user_id = await isIDGood(req.user._id)
    checkRequiredData(req.body, ['chat_session_id'], 'CHAT_SESSSION.MISSING_FIELD')
    const chat_session_id = req.body?.chat_session_id

    res.status(200).json(await delete_chat_session_from_db(user_id, chat_session_id))
  } catch (error) {
    handleError(res, error)
  }
}