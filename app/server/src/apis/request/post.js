import jsonToFormData from '~/utils/jsonToFormData'

export const postRequest = async (domain = '', route = '/', formData = {}) => {
  const url = `${domain}${route}`

  const structure = {
    method: 'POST',
    body: jsonToFormData(formData)
  }

  const res = await fetch(url, structure)
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw errorData.errors
        })
      }
      return response.json()
    })

  return res
}