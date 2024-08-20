import { redirect } from '@sveltejs/kit';
import { hasAuthority } from '../../api.js';

export async function load() {
	if (!hasAuthority(['ROLE_ADMIN'])) redirect(404);
}
