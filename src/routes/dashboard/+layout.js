import { get } from 'svelte/store';
import { ACCESS_TOKEN } from '../../stores/AccessToken.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	if (get(ACCESS_TOKEN) == null) redirect(301, '/signin');
	return {};
}
