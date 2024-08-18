import { API_URL, authfetch } from '../../../api.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		notices: await authfetch(`${API_URL()}/notices`).then((data) => data.json())
	};
}
