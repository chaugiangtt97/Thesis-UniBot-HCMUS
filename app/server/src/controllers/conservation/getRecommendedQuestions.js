import { handleError } from '../../middlewares/utils'
import getRecommendedQuestionsFromDB from './helper/getRecommendedQuestionsFromDB'

export const getRecommendedQuestions = async (req, res) => {
  try {
    res.status(200).json(await getRecommendedQuestionsFromDB())
  } catch (error) {
    handleError(res, error)
  }
}

export default getRecommendedQuestions