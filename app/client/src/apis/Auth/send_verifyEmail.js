import { server_domain as SERVER_DOMAIN } from '../apiRoute'

export const send_verifyEmail = async (email, code = null, captchaToken = null) => {
	const url = `${SERVER_DOMAIN}/request_verifyEmail?email=${email}&code=${code}&captchaToken=${captchaToken}`;
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
			console.error('Yêu cầu xác thực thất bại !', err)
			if(typeof(err) == "object"){
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		}) 

	return res
}