/* eslint-disable no-unused-vars */

import { buildErrObject } from '../middlewares/utils'

const domain = `http://${process.env.KHTNCHATBOT_HOST}:${process.env.KHTNCHATBOT_PORT}`

function convertToString(a) {
  if (typeof a === 'string') {
    return a;  // Nếu a là chuỗi, giữ nguyên
  } else if (typeof a === 'object' && a !== null) {
    return JSON.stringify(a);  // Nếu a là object (JSON), chuyển thành chuỗi
  }
  return String(a);  // Trong trường hợp khác, chuyển thành chuỗi
}

export const chatbotService = async (http_method = 'GET', params = '', get_value = [], post_value = {}, api_key = null) => {
  const query = get_value.reduce((accumulator, currentValue) => `${accumulator}&${currentValue[0]}=${currentValue[1]}`, 'index=0')

  const formData = new FormData()

  Object.entries(post_value).map((data) => {
    let value = data[1]
    
    if(typeof value === 'object' && value !== null) {
      value = Object.keys(data[1]).map(key => {
        return JSON.stringify({ [key]: data[1][key] });
      });
    }

    // Chuyển đối tượng thành mảng với các đối tượng con
    formData.append(data[0], convertToString(value))
  })

  const url = `${domain}/${params}?${query}`

  let structure = {
    method: http_method
  }

  if (http_method != 'GET') { structure = { ...structure, body: formData || [] } }

  return fetch(url, structure)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .catch(error => {
      throw buildErrObject(422, error)
    })
}

