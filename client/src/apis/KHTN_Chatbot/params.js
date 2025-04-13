const domain = import.meta.env.VITE_SERVER

export const getParams = async (token = null) => {
	const url = `${domain}/admin/chatbot/params`;
	const structure = {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
		}
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
		.catch((err) => {
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 
	return res
}

export const postParams = async (token = null, data = null) => {
	const url = `${domain}/admin/chatbot/params`;
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
		.catch((err) => {
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 
	return res
}