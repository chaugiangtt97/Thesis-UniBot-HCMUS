import { buildErrObject } from '../../../middlewares/utils'

/* eslint-disable no-unused-vars */
const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`

export const extract_meta = async (userInput, chosen_collections, history, api_key = null) => {
  const url = `${domain}/generate/extract_meta?query=${encodeURIComponent(userInput)}&chosen_collection=${encodeURIComponent(chosen_collections)}}`
  const formData = new FormData()
  formData.append('history', JSON.stringify(history) )
  formData.append('query', userInput )
  formData.append('chosen_collection', chosen_collections )

  const structure = {
    method: 'POST',
    body: formData
  }

  // Thực hiện GET request
  return fetch(url, structure)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .catch(error => {
      throw buildErrObject(422, error)
    })
}

