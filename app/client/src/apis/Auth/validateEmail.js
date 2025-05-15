const domain = import.meta.env.VITE_SERVER

export const validateEmail = async (data, api_key = null) => {
	const url = `${domain}/verifyEmail?_id=${encodeURIComponent(data)}`;

	const structure = {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json'
		},
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
			console.log(err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}