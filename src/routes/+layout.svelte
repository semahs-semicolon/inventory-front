<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Alerts from '../components/Alert/Alerts.svelte';
	import '../app.css';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	const popup = writable(undefined);
	setContext('popup', popup);

	let aghhh;
	let tomb;

	$: {
		if (aghhh != null) {
			while (aghhh.firstChild) {
				tomb.appendChild(aghhh.lastChild);
			}
			if ($popup) aghhh.appendChild($popup.htmlDomElem);
		}
	}
</script>

<slot />
<ProgressBar color="#FFFF00" zIndex={100} />
<Alerts />
<div
	class="contextmenu"
	style:display={$popup ? 'flex' : 'none'}
	style:left={`${$popup?.x ?? 0}px`}
	style:top={`${$popup?.y ?? 0}px`}
	bind:this={aghhh}
></div>
<div class="tomb" bind:this={tomb}></div>

<style>
	.tomb {
		display: none;
	}
	.contextmenu {
		position: fixed;
		display: flex;
		z-index: 999;
		max-width: 300px;
	}
</style>
