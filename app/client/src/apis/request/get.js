export const getRequest = async (domain = '', route = '/', params = null, token = null) => {

	const queryString = params ? new URLSearchParams(params).toString() : '';
	const url = `${domain}${route}?${queryString}`;
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
			throw typeof err == "object" ? "ERR_CONNECTION_REFUSED" : err
		})

	return res
}