const domain = import.meta.env.VITE_SERVER

export const uploadFile = async (formData = null, token = null) => {
	const url = `${domain}/documents/upload`;
	const structure = {
		method: 'POST',
		headers: {
            'Authorization': `Bearer ${token}`
		},
        body: formData
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