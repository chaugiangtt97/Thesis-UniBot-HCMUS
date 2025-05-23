export const getRequest = async (domain = '', route = '/', params = null) => {

  const queryString = params ? new URLSearchParams(params).toString() : ''
  const url = `${domain}${route}?${queryString}`
  const structure = {
    method: 'GET'
  }

  return await fetch(url, structure)
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw errorData.errors
        })
      }
      return response.json()
    })

}