const domain = import.meta.env.VITE_SERVER

export const login = async (data, api_key = null) => {
	const url = `${domain}/login`;
	const structure = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	  }

	return await fetch(url, structure)
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
			console.log('err',err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			console.log(err)
			throw err
		}) 

}