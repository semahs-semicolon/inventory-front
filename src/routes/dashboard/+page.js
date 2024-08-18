import { API_URL, authfetch } from '../../api.js';
import { searchId } from '../../utils/treeManipulation';
import { get } from 'svelte/store';
import { ACCESS_TOKEN } from '../../stores/AccessToken.js';
import { unauthorized } from '../../utils/ErrorHandler.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	if (!get(ACCESS_TOKEN)) {
		unauthorized({});
		return;
	}
	const [fullTree, itself, items] = await Promise.all([
		authfetch(`${API_URL()}/locations`).then((data) => data.json()),
		authfetch(`${API_URL()}/locations/0`).then((data) => data.json()),
		authfetch(`${API_URL()}/locations/0/items`).then((data) => data.json())
	]);
	return {
		fullTree: fullTree,
		tree: searchId({ children: fullTree }, '0'),
		itself: itself,
		items: items
	};
}
