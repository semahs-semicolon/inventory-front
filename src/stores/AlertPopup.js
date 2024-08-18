import { get, writable } from 'svelte/store';

export const AlertList = writable([]);
export const AlertNumber = writable(0);
export const AlertDisappearTime = 3000;
/**
 *
 * @param {string} message
 * @param {string} description
 * @param {("info" | "error" | "warning")} level
 * @param {boolean} removable
 * @return {number} alertID
 *
 */
export function addAlert(message, description = '', level, removable) {
	if (message.length > 0) {
		const alertID = get(AlertNumber);
		AlertList.update((current) => {
			return [...current, { id: alertID, message, description, level, removable }];
		});
		AlertNumber.set(alertID + 1);
		return alertID;
	}
}

/**
 *
 * @param {number }alertID
 */
export function removeAlert(alertID) {
	AlertList.update((current) => {
		const i = current.findIndex((item) => item.id === alertID);
		current.splice(i, 1);
		return current;
	});
}

/**
 *
 * @param {number} alertID
 * @param {{message?: string, description?: string, level?: ("info" | "error" | "warning"), removable?: boolean}} updateAlert
 */
export function updateAlert(alertID, ...updateAlert) {
	AlertList.update((current) => {
		const i = current.findIndex((item) => item.id === alertID);
		current[i] = { ...current[i], ...updateAlert };
		return current;
	});
}
