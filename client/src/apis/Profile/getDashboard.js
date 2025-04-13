const domain = import.meta.env.VITE_SERVER

export const getDashboard = async (token = null) => {
	const url = `${domain}/dashboard`;
	const structure = {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}