import { API_URL, authfetch } from '../../../api.js';

export async function load() {
	const [codes, identifier] = await Promise.all([
		authfetch(`${API_URL()}/verifyCode/verifyCode`).then((data) => data.json()),
		authfetch(`${API_URL()}/verifyCode/identifier`).then((data) => data.json())
	]);
	return {
		codes,
		identifier
	};
}
