import { API_URL, authfetch } from '../../../api.js';

export async function load({ params }) {
	return {
		categories: await authfetch(`${API_URL()}/categories/all`).then((data) => data.json())
	};
}
