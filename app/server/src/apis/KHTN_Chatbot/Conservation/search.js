import { buildErrObject } from '../../../middlewares/utils'

/* eslint-disable no-unused-vars */
// const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`
const domain = process.env.PYTHON_URI || 'http://localhost:5000'

export const search = async (userInput, chosen_collection, filter_expressions, api_key = null) => {
  // const url = `${domain}/generate/search?query=${encodeURIComponent(userInput)}&chosen_collection=${encodeURIComponent(chosen_collection)}&filter_expressions=${encodeURIComponent(filter_expressions)}`
  const url = `${domain}/generate/search`

  const formData = new FormData()
  formData.append('query', userInput )
  formData.append('chosen_collection', chosen_collection )
  formData.append('filter_expressions', JSON.stringify(filter_expressions) )

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
      throw buildErrObject(422, error)
    })
}
