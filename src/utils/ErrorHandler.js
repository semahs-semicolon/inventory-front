import { ACCESS_TOKEN } from '../stores/AccessToken.js';
import { goto } from '$app/navigation';
import { addAlert } from '../stores/AlertPopup.js';

/**
 * @function
 * @param {{message?: string, description?: string}} alert
 */
export function unauthorized(alert) {
	if (alert.message) {
		addAlert(alert.message, alert.description, 'error', false);
	} else {
		ACCESS_TOKEN.set(null);
		goto('/error/unauthorized');
	}
}
/**
 * @function
 * @param {{message?: string, description?: string}} alert
 */
export function badRequest(alert) {
	if (alert.message) {
		addAlert(alert.message, alert.description, 'error', false);
	}
}

export function internalServerError() {
	addAlert('내부적인 문제가 발생하였습니다.', '', 'error', true);
}
