import RecommendedQuestions from '../../../../models/recommended_questions'
import { buildErrObject } from '../../../../middlewares/utils'

/**
 * Gets profile from database by id
 * @param {string} id - session id
 * @param {string} user - user Object
 */
export const getRecommendedQuestionsFromDB = async () => {
  try {
    return await RecommendedQuestions.find({}, '-_id')
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

export default getRecommendedQuestionsFromDB