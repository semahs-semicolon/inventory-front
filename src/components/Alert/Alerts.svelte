<script>
	import { AlertList } from '../../stores/AlertPopup.js';
	import AlertElement from './AlertElement.svelte';

	export const maxAlertNumber = 3;

	let alerts = [];

	AlertList.subscribe((value) => {
		let temp = [];
		value.reverse().forEach((alert) => {
			if (temp.length < maxAlertNumber) {
				temp.push(alert);
			}
		});
		alerts = temp;
	});
</script>

<div class="absolute bottom-0 left-0 flex flex-col gap-5 p-6">
	{#each alerts as alert}
		<AlertElement alertID={alert.id} {alert} />
	{/each}
</div>
