<script>
	import { API_URL, imageIdToUrl } from '../../api.js';
	import { goto } from '$app/navigation';

	export let product;
	export let draggable = false;
	export let selected = false;

	function generateHTML(a) {
		return a
			.replaceAll('_ ', '_')
			.replaceAll(' _', '_')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('$$ST1$$', '<span class="highlight-match">')
			.replaceAll('$$ST2$$', '</span>');
	}
</script>

<div
	class="relative flex gap-4 self-stretch rounded-lg bg-neutral-200 p-2"
	{draggable}
	class:enabledrag={draggable}
	on:dragstart={(e) => {
		e.dataTransfer.dropEffect = 'move';
		e.dataTransfer.setData('seda/product', JSON.stringify(product));
	}}
	class:selected
	on:click
	on:dblclick
	on:mouseover
	on:mouseover
>
	<img src={imageIdToUrl(product.primaryImage, `thumbnail`)} class="aspect-square h-10 w-10 rounded" alt={`${product.name} 이미지`} />
	<div class="mr-10 flex w-full flex-col">
		<span class="text-base font-medium text-gray-800">
			{#if product.highlightName}
				{@html generateHTML(product.highlightName)}
			{:else}
				{product.name}
			{/if}
		</span>
		<span class="max-h-4 w-full overflow-y-hidden text-sm text-gray-600">
			{#if product.highlightDesc != undefined}
				{@html generateHTML(product.highlightDesc)}
			{:else}
				{product.description}
			{/if}
		</span>
	</div>
	<button
		class="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-lg bg-[#275eb0]"
		on:click={() => {
			goto(`/dashboard/products/${product.id}`);
		}}
	>
		<span class="material-symbols-outlined text-base font-semibold text-white">arrow_forward</span>
	</button>
</div>

<style>
	:global(.highlight-match) {
		color: #ffa200;
		font-weight: 500;
	}
	.box {
		border-color: black;
		border-width: 1px;
		border-style: solid;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tree-element .description {
		color: gray;
		text-overflow: ellipsis;
		height: 1em;
		overflow: hidden;
		display: block;
		width: 200px;
		white-space: nowrap;
	}
	.tree-element .name {
		display: flex;
		flex-direction: column;
	}
	.tree-element .image img {
		width: 2em;
		height: 2.5em;
		object-fit: contain;
	}
	.tree-element .image {
		display: flex;
		max-height: 100%;

		width: 2em;
		min-width: 2em;
		max-width: 2em;
		align-items: center;
		justify-content: center;
	}
	.tree-element {
		padding: 0.5em;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		gap: 0.5em;

		max-height: 100%;
		align-self: stretch;
		min-height: 3em;
		border-radius: 0.5em;
		overflow-x: hidden;
		background-color: white;
	}
	.tree-element:hover {
		background-color: #1d1b2014;
	}
	.tree-element:active {
		background-color: #1d1b201a;
	}
	.selected {
		background-color: #4d9de71a;
	}

	.enabledrag:hover {
		background-color: #4d9de714;
	}
	.enabledrag:active {
		background-color: #4d9de71a;
	}
</style>
