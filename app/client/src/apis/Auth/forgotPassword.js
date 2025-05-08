const domain = import.meta.env.VITE_SERVER

export const forgotPassword = async (data, api_key = null) => {
	const url = `${domain}/register`;
	const structure = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
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