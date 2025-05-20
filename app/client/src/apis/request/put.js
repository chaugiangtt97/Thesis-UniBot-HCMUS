export const putRequest = async (domain = '', route = '/', formData = null, token = null) => {
	const url = `${domain}${route}`;
	const structure = {
		method: 'PUT',
		headers: {
		  'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
		},
    body: JSON.stringify(formData)
	}
	console.log(formData)
	const res = await fetch(url, structure)
		.then(async (response) => {
			if (!response.ok) {
				return response.json().then(errorData => {
					throw errorData
				});
			}
			return response.json()
		})
		.then(data => {
			return data
		})
		.catch((err) => {
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}