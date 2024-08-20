import { get } from 'svelte/store';
import { ACCESS_TOKEN } from './stores/AccessToken.js';

import { dev } from '$app/environment';
import { internalServerError, unauthorized } from './utils/ErrorHandler.js';

export const API_URL = () => `https://${dev ? 'staging.inventory.seda.club' : location.hostname}/api`;

export function authfetch(uri, init = { method: 'GET', headers: {} }) {
	let token = get(ACCESS_TOKEN);
	init.headers = init.headers || {};
	if (token !== null) init.headers['Authorization'] = 'Bearer ' + token;
	return fetch(uri, init).then((res) => {
		switch (res.status) {
			case 401:
				unauthorized({});
				break;
			case 500:
				internalServerError();
				break;
			default:
				return res;
		}
	});
}

/**
 *
 * @param {Array<string>} authorities
 * @return {boolean}
 */
export function hasAuthority(authorities) {
	let token = get(ACCESS_TOKEN);
	let payload = token.split('.')[1];
	let payload_json = JSON.parse(atob(payload));
	return authorities.every((i) => {
		return payload_json['authorities'].includes(i);
	});
}

export function imageIdToUrl(id, options = '200,fit,jpeg') {
	return `https://${dev ? 'staging.inventory.seda.club' : location.hostname}/scaled/${options}/${id}`;
}
export function modelIdToUrl(id) {
	return `https://${dev ? 'staging.inventory.seda.club' : location.hostname}/image/${id}`;
}
