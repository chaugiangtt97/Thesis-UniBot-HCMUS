/* eslint-disable no-unused-vars */

import { buildErrObject } from '../../../middlewares/utils'

const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`

export const delete_file = async (formData = null) => {
  const url = `${domain}/delete_file`
  const structure = {
    method: 'POST',
    body: formData
  }
  // Thực hiện POST request
  return fetch(url, structure)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .catch(error => {
      throw buildErrObject(422, error)
    })
}

