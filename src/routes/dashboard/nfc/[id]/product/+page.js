import { API_URL, authfetch } from '../../../../../api.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const [product, items, tree] = await Promise.all([
		authfetch(`${API_URL()}/products/${params.id}`).then((data) => data.json()),
		authfetch(`${API_URL()}/products/${params.id}/items`).then((data) => data.json()),
		authfetch(`${API_URL()}/locations`).then((data) => data.json())
	]);
	return {
		product: product,
		items: items,
		tree: tree
	};
}
