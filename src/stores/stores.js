import { writable } from 'svelte/store';

export const LAST_URL = writable(undefined);

export const SEARCH = writable('');
export const LAST_SEARCH_RESULT = writable([]);

export const CATEGORIES = writable({});
