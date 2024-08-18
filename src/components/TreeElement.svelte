<script>
	import { createEventDispatcher } from 'svelte';
	import { scale, slide } from 'svelte/transition';

	export let element;

	let shrunk = element.children.length <= 0;

	export let interact = false;
</script>

<div class="tree-element">
	<div class="flex items-center">
		<button on:click={() => (shrunk = !shrunk || element.children.length <= 0)} class="flex">
			<span class="material-symbols-outlined animate text-xl" class:rotate={shrunk}>
				{element.children.length >= 1 ? 'expand_more' : 'fiber_manual_record'}
			</span>
		</button>
		<slot name="element" {element}>
			<span>{element.name}</span>
		</slot>
	</div>
	{#if !shrunk && element.children.length > 0}
		<div class="line" transition:slide>
			<hr />
			<div class="tree-children">
				{#each element.children as child}
					<svelte:self element={child} {interact}>
						<slot name="element" slot="element" let:element {element} />
					</svelte:self>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.rotate {
		rotate: -90deg;
	}
	.animate {
		transition: rotate 0.5s;
		padding: 0;
	}
	button {
		background: none;
		cursor: pointer;
		border: none;
		padding: 0;
	}
	.line {
		display: flex;
		flex-direction: row;
		padding-left: 1em;
	}

	.tree-element {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.tree-header {
		display: flex;
		flex-direction: row;
		justify-content: start;
	}
	hr {
		padding: 0;
		margin: 0;
	}

	.tree-children {
		display: flex;
		flex-direction: column;
		align-items: start;
		padding-left: 0.5em;
		padding-top: 0.1em;
		gap: 0.1em;
		width: 100%;
	}
</style>
