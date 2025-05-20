import checkRequiredData from '~/utils/checkRequiredData'
import { buildErrObject, handleError, isIDGood } from '../../../middlewares/utils'
import { update_profile_from_db } from './helpers/update_profile_in_db'
import findUser from './helpers/findUser'
import { get_user } from './helpers/get_user'

export const get_profile = async (req, res) => {
  try {
    const user_id = await isIDGood(req.user._id)
    const user = await findUser(null, user_id)
    res.status(200).json(get_user(user))
  } catch (error) {
    handleError(res, error)
  }
}

export const update_profile = async (req, res) => {
  try {
    const user_id = await isIDGood(req.user._id)
    checkRequiredData( req.body, ['dataUpdate'])

    const dataUpdate = req.body?.dataUpdate

    if (dataUpdate == {})
      throw buildErrObject(404, 'CHAT_SESSION.INVALID_DATA_UPDATE', 'dataUpdate is empty')

    res.status(200).json(await update_profile_from_db(user_id, dataUpdate))
  } catch (error) {
    handleError(res, error)
  }
}