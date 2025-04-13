/**
 * Updated by Mach Vi Kiet's author on November 15 2024
 */

import UserAccess from '../../models/userAccess'

export const savetoken = async (token, socketId) => {
  try {
    const session = await UserAccess.findOneAndUpdate(
      { token },
      { $set: { 'socketid': socketId } },
      { new: true }
    )
    return session
  } catch (err) {
    throw {
      errors: {
        msg: err.message
      }
    }
  }
}

export default savetoken