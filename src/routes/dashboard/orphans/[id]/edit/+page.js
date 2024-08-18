import { API_URL, authfetch } from '../../../../../api.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		product: await authfetch(`${API_URL()}/products/${params.id}`).then((data) => data.json())
	};
}
