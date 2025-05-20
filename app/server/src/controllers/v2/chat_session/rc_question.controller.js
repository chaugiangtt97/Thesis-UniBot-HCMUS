// Recommended Question
import { handleError } from '../../../middlewares/utils'

import { get_recommended_questions_from_db } from './helpers/get_recommended_questions_from_db'

export const get_recommended_questions = async (req, res) => {
  try {
    res.status(200).json(await get_recommended_questions_from_db())
  } catch (error) {
    handleError(res, error)
  }
}

