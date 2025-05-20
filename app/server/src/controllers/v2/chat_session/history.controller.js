import { buildErrObject, handleError, isIDGood } from '../../../middlewares/utils'

const checkRequiredData = (data, required_list = []) => {
  try {
    required_list.map((key) => {
      if (!data?.[key]) throw `Field ${key} is missing!`
    })
  } catch (e) {
    throw buildErrObject(404, 'CHAT_SESSION.MISSING_FIELD', `Required field - ${e}`)
  }
}

import { get_history_from_db } from './helpers/get_history_from_db'
import { create_history_from_db } from './helpers/create_history_from_db'
import { delete_history_from_db } from './helpers/delete_history_from_db'
import { update_history_from_db } from './helpers/update_history_from_db'

export const get_history_in_chat_session = async (req, res) => {
  try {

    const usr_id = await isIDGood(req.user._id)

    let chat_session_id = req.query?.history_id
    let history_id = req.query?.chat_session_id

    try {
      history_id = await isIDGood(req.query?.history_id)
    } catch (e) {
      chat_session_id = await isIDGood(req.query?.chat_session_id)
        .catch((err) => err)
    }

    res.status(200).json(await get_history_from_db( usr_id, chat_session_id, history_id))
  } catch (error) {
    handleError(res, error)
  }
}

export const update_history_in_chat_session = async (req, res) => {
  try {
    checkRequiredData(req.body, ['dataUpdate', 'history_id'])

    const usr_id = await isIDGood(req.user._id)
    const dataUpdate = req.body?.dataUpdate
    const history_id = req.body?.history_id

    if (dataUpdate == {})
      throw buildErrObject(404, 'CHAT_SESSION.INVALID_DATA_UPDATE', 'dataUpdate is empty')

    res.status(200).json(await update_history_from_db(usr_id, history_id, dataUpdate))
  } catch (error) {
    handleError(res, error)
  }
}

export const delete_history_in_chat_session = async (req, res) => {
  try {
    checkRequiredData(req.body, ['history_id'])

    const usr_id = await isIDGood(req.user._id)
    const history_id = await isIDGood(req.body.history_id)

    res.status(200).json(await delete_history_from_db(usr_id, history_id))
  } catch (error) {
    handleError(res, error)
  }
}

export const create_history_in_chat_session = async (req, res) => {
  try {
    checkRequiredData(req.body, ['new_conservation'])

    const new_conservation = await isIDGood(req.body.new_conservation)

    res.status(200).json(await create_history_from_db(req.user, new_conservation))
  } catch (error) {
    handleError(res, error)
  }
}