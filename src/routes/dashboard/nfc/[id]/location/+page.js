import { API_URL, authfetch } from '../../../../../api.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const [itself] = await Promise.all([authfetch(`${API_URL()}/locations/${params.id}`).then((data) => data.json())]);
	return {
		itself: itself
	};
}
