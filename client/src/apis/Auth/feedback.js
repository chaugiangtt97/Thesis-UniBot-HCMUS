const domain = import.meta.env.VITE_SERVER

export const feedback = async (token = null, data, api_key = null) => {
	const url = `${domain}/feedback`;
	const structure = {
		method: 'POST',
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
			console.error('Feedback thất bại !', err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}