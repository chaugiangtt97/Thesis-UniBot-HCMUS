import { buildErrObject } from '../../../../middlewares/utils'
import User from '../../../../models/user'

export const update_profile_from_db = async (user_id = null, dataUpdate = null ) => {
  try {
    if (!dataUpdate || !user_id) {
      throw 'Data Update and user id must be required!'
    }

    if ( dataUpdate?.password ) {
      throw 'Cannot update password!'
    }

    ['password', 'blockExpires', 'verified', 'verification', '_id', 'createdAt'].map((key) => {
      if (dataUpdate?.[key]) throw `Field ${key} invalid!`
    })

    return await User
      .findByIdAndUpdate( user_id, dataUpdate, {
        new: true, runValidators: true,
        select: '-password -verification -_id -createdAt' })
      .then((user) => {
        if (!user) throw buildErrObject(422, 'USER.NOT_FOUND', 'Can not find data from database')
        return user
      })
  } catch (e) {
    throw buildErrObject(505, 'USER.ERR_UPDATE_PROFILE', e)
  }
}