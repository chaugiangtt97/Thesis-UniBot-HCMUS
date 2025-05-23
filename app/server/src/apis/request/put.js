import jsonToFormData from '~/utils/jsonToFormData'

export const putRequest = async (domain = '', route = '/', formData = null) => {
  const url = `${domain}${route}`
  const structure = {
    method: 'PUT',
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