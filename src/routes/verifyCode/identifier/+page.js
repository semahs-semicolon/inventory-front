import { API_URL, authfetch } from '../../../api.js';

export async function load() {
	const [identifier] = await Promise.all([authfetch(`${API_URL()}/verifyCode/identifier`).then((data) => data.json())]);
	return {
		identifier
	};
}
