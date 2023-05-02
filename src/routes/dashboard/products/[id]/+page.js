import { API_URL, authfetch } from '../../../../api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        product: await authfetch(`${API_URL}/products/${params.id}`).then(data => data.json()),
        items: await authfetch(`${API_URL}/products/${params.id}/items`).then(data => data.json()),
        tree: await authfetch(`${API_URL}/locations`).then(data => data.json())
    }
}