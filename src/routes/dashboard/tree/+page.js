import { redirect } from '@sveltejs/kit';

export async function load() {
	redirect(301, '/dashboard/tree/0');
}
