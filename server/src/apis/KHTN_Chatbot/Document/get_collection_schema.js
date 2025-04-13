/* eslint-disable no-unused-vars */

import { buildErrObject } from '../../../middlewares/utils'

const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`

export const get_collection_schema = async (collectionName = null) => {
  const url = `${domain}/get_collection_schema?collection_name=${encodeURIComponent(collectionName)}`
  // Thực hiện GET request
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .catch(error => {
      throw buildErrObject(422, error)
    })
}

