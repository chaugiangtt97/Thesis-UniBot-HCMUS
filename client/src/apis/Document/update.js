const domain = import.meta.env.VITE_SERVER

export const update = async (data, token = null) => {
	const url = `${domain}/documents`;
	const structure = {
		method: 'PATCH',
		headers: {
		  'Content-Type': 'application/json',
      		'Authorization': `Bearer ${token}`
		},
      body: JSON.stringify(data)
	  }

	const res = await fetch(url, structure)
		.then(async (response) => {
			if (!response.ok) {
				return response.json().then(errorData => {
					throw errorData.errors.msg;
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