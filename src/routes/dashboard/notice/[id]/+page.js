import { API_URL, authfetch } from '../../../../api.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		notice: await authfetch(`${API_URL()}/notices/${params.id}`).then((data) => data.json())
	};
}
