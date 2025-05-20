import RecommendedQuestions from '../../../../models/recommended_questions'
import { buildErrObject } from '../../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - session id
 * @param {string} user - user Object
 */
export const get_recommended_questions_from_db = async () => {
  try {
    return await RecommendedQuestions.find({}, '-_id')
  } catch (error) {
    throw buildErrObject(422, 'CHAT_SESSION.RC_QUESTION._ERR_GET', error)
  }
}