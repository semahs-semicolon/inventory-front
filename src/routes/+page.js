import { get } from 'svelte/store';
import { ACCESS_TOKEN } from '../stores/AccessToken.js';
import { goto } from '$app/navigation';

export const csr = true;
export const prerender = true;

export async function load() {
	if (get(ACCESS_TOKEN) !== null) {
		goto('/dashboard');
	}
}
