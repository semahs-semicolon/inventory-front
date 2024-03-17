<script>
	import Product from "../../../components/product/Product.svelte";
	import Products from "../../../components/product/Products.svelte";
	import {goto} from '$app/navigation'
  	import { page } from "$app/stores";

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import CloseButton from "../../../components/button/CloseButton.svelte";
	import { fly } from "svelte/transition";

	const open = writable({should: false, open: false});
	let innerWidth = 10000;
	let innerHeight;
	
	setContext('menu-context', open);
	
	$: $open.should = innerWidth < 1000;


	console.log($page)
</script>
<svelte:window bind:innerWidth bind:innerHeight />
<div class="wrapper">
	{#if innerWidth < 1000 && $open.open}
	<div class="bg"/>
	{/if}
	{#if innerWidth >= 1000 || $open.open || $page.params.id == undefined}
		<div class="responsive" class:menu={innerWidth < 1000 && $open.open} transition:fly={{duration: 250, x: '-100%', opacity: 1}}>
			<Products>
				<div slot="product" let:product>
					<Product {product} selected={$page.params?.id == product.id} on:click={() => {goto(`/dashboard/products/${product.id}`); $open.open = false;}}/>
				</div>
			</Products>
			{#if $open.open}
				<div class="toolbarClose">
					<CloseButton on:click={() => {$open.open = false}}/>
				</div>
			{/if}
		</div>
	{/if}
	<slot>
		<button>aa</button>
	</slot>
</div>

<style>
	.bg {
        z-index: 30;
        background-color: #322F37;
        opacity: 0.4;
        position: absolute;
        width: 100%;
        height: 100%;
	}
	.wrapper {
		display: flex;
		justify-content: start;
		width: 100%;
	}
	.responsive {
		display: flex;
		max-width: 500px;
		z-index: 40;
	}
	@media(max-width: 1000px) {
		.responsive {
			flex: 1;
			align-items: stretch;
			justify-content: stretch;
			width: 100%;
			width: 500px;
			position: absolute;
			height: 100%;
		}
		.wrapper {
			justify-content: center;
		}
	}
	.menu {
		left: 0;
	}
	.toolbarClose {
		position: absolute;
		right: -1.5em;
	}
</style>