
import { API_URL, authfetch } from '../../../api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        categories: await authfetch(`${API_URL()}/categories`).then(data => data.json()),
        products: await authfetch(`${API_URL()}/products/nocategory`).then(data => data.json()),
        ai: await authfetch(`${API_URL()}/categories/ai`).then(data => data.json()),
    }
}