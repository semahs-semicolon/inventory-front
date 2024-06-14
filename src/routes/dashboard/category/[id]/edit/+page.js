
import { API_URL, authfetch } from '../../../../../api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        category: await authfetch(`${API_URL()}/categories/${params.id}`).then(data => data.json())
    }
}