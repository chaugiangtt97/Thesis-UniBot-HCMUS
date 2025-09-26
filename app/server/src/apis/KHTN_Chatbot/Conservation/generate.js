import { buildErrObject } from '../../../middlewares/utils'

/* eslint-disable no-unused-vars */
// const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`
const domain = process.env.PYTHON_URI || 'http://localhost:5000'

export const generate = async (userInput, context, streaming = 'False', history = [], user_profile = '', collection_name = '', api_key = null) => {
  const url = `${domain}/generate/`
  const formData = new FormData()
  formData.append('query', userInput )
  formData.append('context', context )
  formData.append('streaming', String(streaming) )
  formData.append('history', JSON.stringify(history) )
  formData.append('user_profile', user_profile )
  formData.append('collection_name', collection_name )

  const structure = {
    method: 'POST',
    body: formData
  }
  // Thực hiện POST request
  const res = await fetch(url, structure)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response
    })
    .catch(error => {
      console.log(error)
      throw buildErrObject(422, error)
    })

  return res
}

