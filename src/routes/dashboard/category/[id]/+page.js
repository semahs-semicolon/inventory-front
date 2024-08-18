import { API_URL, authfetch } from '../../../../api.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const [categories, category] = await Promise.all([
		authfetch(`${API_URL()}/categories/${params.id}/categories`).then((data) => data.json()),
		authfetch(`${API_URL()}/categories/${params.id}`).then((data) => data.json())
	]);

	return {
		categories: categories,
		category: category
	};
}
