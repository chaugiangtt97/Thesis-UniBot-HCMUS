import { buildSuccObject, handleError } from '~/middlewares/utils'
import { chatbotService } from '~/services/chatbot'

export const postRequest = async (req, res) => {
  try {
    await chatbotService('POST', req.params.id, [], req?.body)
    res.status(200).json(buildSuccObject('success'))
  } catch (error) {
    handleError(res, error)
  }
}

export default postRequest