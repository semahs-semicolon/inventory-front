import { API_URL, authfetch } from '../../../../api';
import { searchId } from '../../../../utils/treeManipulation';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const fullTree = await authfetch(`${API_URL()}/locations`).then(data => data.json());
    return {
        fullTree: fullTree,
        tree: searchId({children: fullTree}, params.id),
        itself: await authfetch(`${API_URL()}/locations/${params.id}`).then(data => data.json()),
        items: await authfetch(`${API_URL()}/locations/${params.id}/items`).then(data => data.json())
    }
}