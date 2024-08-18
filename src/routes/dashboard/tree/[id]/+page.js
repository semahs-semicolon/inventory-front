import { API_URL, authfetch } from '../../../../api.js';
import { searchId } from '../../../../utils/treeManipulation';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const [fullTree, itself, items] = await Promise.all([
		authfetch(`${API_URL()}/locations`).then((data) => data.json()),
		authfetch(`${API_URL()}/locations/${params.id}`).then((data) => data.json()),
		authfetch(`${API_URL()}/locations/${params.id}/items`).then((data) => data.json())
	]);
	return {
		fullTree: fullTree,
		tree: searchId({ children: fullTree }, params.id),
		itself: itself,
		items: items
	};
}
