const domain = import.meta.env.VITE_SERVER

export const getCollection = async (token = null) => {
	const url = `${domain}/collections`;
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
		.then(data => {
			return data
		})
		.catch((err) => {
			console.error('Lấy thông tin collections thất bại ! ', err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}