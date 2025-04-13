const domain = import.meta.env.VITE_SERVER

export const createCollection = async (token = null, formData = null) => {
	const url = `${domain}/collections/new_collection`;
	const structure = {
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
		},
        body: JSON.stringify(formData)
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
			console.error('Tạo chủ đề mới thất bại ! ', err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}