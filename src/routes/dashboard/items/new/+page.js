import { API_URL, authfetch } from '../../../../api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        fullTree: await authfetch(`${API_URL}/locations`).then(data => data.json())
    }
}