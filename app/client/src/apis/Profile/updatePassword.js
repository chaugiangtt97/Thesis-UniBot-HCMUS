const domain = import.meta.env.VITE_SERVER

export const updatePassword = async (data, token = null) => {
	const url = `${domain}/updatePassword`;
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
			if( Array.isArray(err) ) {
				throw 'Thất Bại: Vui Lòng Nhập Đủ Các Thông Tin !'
			}
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}