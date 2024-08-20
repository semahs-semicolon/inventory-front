<script>
	import { fly, slide } from 'svelte/transition';
	import { API_URL, authfetch } from '../../api.js';
	import { SEARCH } from '../../stores/stores.js';
	import Create from './Create.svelte';
	import Search from './Search.svelte';
	import PrimaryButton from '../button/PrimaryButton.svelte';

	let creating = false;
	export let fullscreen = false;
	let name = '';
</script>

<div class="h-full" class:fixed={fullscreen && creating}>
	{#if creating}
		<Create
			bind:productName={$SEARCH}
			on:productCreation={(js) => {
				creating = false;
			}}
		>
			<slot slot="header">
				<PrimaryButton on:click={() => (creating = false)}>검색</PrimaryButton>
			</slot>
		</Create>
	{:else}
		<Search bind:search={$SEARCH}>
			<slot slot="header">
				<PrimaryButton on:click={() => (creating = true)}>+</PrimaryButton>
			</slot>
			<slot slot="product" name="product" let:product {product}>
				<a href={`/dashboard/products/${product.id}`}>{product.name}</a>
			</slot>
		</Search>
	{/if}
</div>

<style>
	.products {
		display: flex;
		flex: 2;
		background-color: white;
	}
	.fixed {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		z-index: 60;
	}
</style>
