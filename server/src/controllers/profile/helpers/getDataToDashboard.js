import User from '../../../models/user'
import Document from '../../../models/document'
import Session from '../../../models/chat_session'
import { buildErrObject } from '../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getDataToDashboard = async (id = '') => {

 try {
    const userCount = await User.countDocuments();
    const documentCount = await Document.countDocuments();
    const sessionCount = await Session.countDocuments();

    return {
        user: userCount,
        document : documentCount,
        session: sessionCount,
         date: new Date().toISOString()
    }
 } catch (e) {
    throw buildErrObject(422, 'Không Thể Lấy Được Dữ Liệu', 'Không Lỗi server: ' + err.message)
 }

  return result
}

export default getDataToDashboard