import { server_domain as SERVER_DOMAIN } from '../apiRoute'

export const get_captcha_token = async (api_key = null) => {
	const url = `${SERVER_DOMAIN}/captcha_token?code=RECAPTCHA`;

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
			if (typeof (err) == "object") {
				throw 'ERR_CONNECTION_REFUSED'
			}
			throw err
		})

	return res
}