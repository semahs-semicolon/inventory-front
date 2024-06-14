
import { API_URL, authfetch } from '../../../../api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        categories: await authfetch(`${API_URL()}/categories/${params.id}/categories`).then(data => data.json()),
        category: await authfetch(`${API_URL()}/categories/${params.id}`).then(data => data.json())
    }
}