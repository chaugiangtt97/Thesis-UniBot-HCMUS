const domain = import.meta.env.VITE_KHTNCHATBOT_SERVICE

export const search = async (userInput, chosen_collection, filter_expressions , api_key = null) => {
	const url = `${domain}/generate/search?query=${encodeURIComponent(userInput)}&chosen_collection=${encodeURIComponent(chosen_collection)}&filter_expressions=${encodeURIComponent(filter_expressions)}`;
	const res = await fetch(url)
		.then(response => {
			if (!response.ok) {
					throw new Error('Network response was not ok');
			}
			return response.json();
			}
		)
		.catch(error => {
			throw new Error(error);
		});

	return res
}
  
  