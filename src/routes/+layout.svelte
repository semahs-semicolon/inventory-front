<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
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
		z-index: 60;
		position: fixed;
		display: flex;
		border-radius: 1em;
		border-color: black;
		background-color: #efefef;
		color: black;
		border-width: 1px;
		padding: 1em;
		z-index: 999;
		border-style: solid;
		max-width: 300px;
	}
</style>
