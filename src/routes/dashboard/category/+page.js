
import { API_URL, authfetch } from '../../../api';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const [categories, products] = await Promise.all([
        authfetch(`${API_URL()}/categories`).then(data => data.json()),
        authfetch(`${API_URL()}/products/nocategory`).then(data => data.json())
    ]);
    return {
        categories: categories,
        products: products
    }
}