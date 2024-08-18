import { get } from 'svelte/store';
import { ACCESS_TOKEN } from '../stores/AccessToken.js';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export const ssr = false;
export const csr = true;
export const prerender = false;

export async function load() {
	if (get(ACCESS_TOKEN) !== null) {
		goto('/dashboard');
	}
}
