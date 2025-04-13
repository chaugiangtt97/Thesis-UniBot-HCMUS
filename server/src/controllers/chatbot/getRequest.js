import { handleError } from '~/middlewares/utils'
import { chatbotService } from '~/services/chatbot'

export const getRequest = async (req, res) => {
  try {
    const postResponses = await chatbotService('GET', req.params?.id )
    res.status(200).json(postResponses)
  } catch (error) {
    handleError(res, error)
  }
}

export default getRequest