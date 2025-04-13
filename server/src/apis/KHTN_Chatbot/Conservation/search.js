import { buildErrObject } from '../../../middlewares/utils'

/* eslint-disable no-unused-vars */
const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`

export const search = async (userInput, chosen_collection, filter_expressions, api_key = null) => {
  const url = `${domain}/generate/search?query=${encodeURIComponent(userInput)}&chosen_collection=${encodeURIComponent(chosen_collection)}&filter_expressions=${encodeURIComponent(filter_expressions)}`

  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .catch(error => {
      throw buildErrObject(422, error)
    })
}
