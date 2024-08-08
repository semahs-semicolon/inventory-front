import { API_URL, authfetch } from '../../api';
import { searchId } from '../../utils/treeManipulation';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const [fullTree, itself, items] = await Promise.all([
        authfetch(`${API_URL()}/locations`).then(data => data.json()),
        authfetch(`${API_URL()}/locations/0`).then(data => data.json()),
        authfetch(`${API_URL()}/locations/0/items`).then(data => data.json())
    ]);
    return {
        fullTree: fullTree,
        tree: searchId({children: fullTree}, '0'),
        itself: itself,
        items: items
    }
}