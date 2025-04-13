const key = import.meta.env.VITE_CHATGPT_KEY

export const usageCompletion = async (page = null, start_time = 1736945264, limit = 30) => {
	const pageID = page ? `&page=${page}` : ''
	const url = `https://api.openai.com/v1/organization/usage/completions?start_time=${start_time}${pageID}`;

	const structure = {
		method: 'GET',
		headers: {
		    'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
		}
	  }

	const res = await fetch(url, structure)
		.then(async (response) => {
			if (!response.ok) {
				return response.json().then(errorData => {
					throw errorData;
				});
			}
			return response.json()
		})
		.then(data => {
			return data
		})
		.catch((err) => {
			console.error('Lấy thông tin thất bại ! ', err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}

export default usageCompletion