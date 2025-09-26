/* eslint-disable no-unused-vars */

import { buildErrObject } from '../../../middlewares/utils'

// const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`
const domain = process.env.PYTHON_URI || 'http://localhost:5000'

export const determine_collection = async (userInput = null, history = [], api_key = null) => {
  // const url = `${domain}/generate/determine_collection?query=${encodeURIComponent(userInput)}`
  const url = `${domain}/generate/determine_collection`

  const formData = new FormData()
  formData.append('history', JSON.stringify(history) )
  formData.append('query', userInput )

  const structure = {
    method: 'POST',
    body: formData
  }

  return fetch(url, structure)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .catch(error => {
      console.log(error)
      throw buildErrObject(422, error)
    })
}

