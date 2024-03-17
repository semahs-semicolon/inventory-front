import { get } from 'svelte/store';
import { API_URL, authfetch } from '../../api';
import { ACCESS_TOKEN } from '../../stores';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        tree: await authfetch(`${API_URL()}/locations`).then(data => data.json())
    }
}