<script>
	import Product from '../../../components/product/Product.svelte';
	import Products from '../../../components/product/Products.svelte';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import CloseButton from "../../../components/button/CloseButton.svelte";
	import { fly } from "svelte/transition";
	import Search from "../../../components/product/Search.svelte";
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";
	import { CATEGORIES } from "../../../stores";

	export let data;

	for (const category of data.categories) {
		$CATEGORIES[category.categoryId] = category;
	}


	const open = writable({should: false, open: false});
	let innerWidth = 10000;
	let innerHeight;

	setContext('menu-context', open);

	$: $open.should = innerWidth < 1000;


	console.log($page)
</script>
<svelte:window bind:innerWidth bind:innerHeight />
<div class="loadingbar"></div>
<div class="grid h-full w-full grid-cols-3">
	{#if innerWidth < 1000 && $open.open}
	<div class="bg"/>
	{/if}
	{#if innerWidth >= 1000 || $open.open || $page.params.id == undefined}
		<div
			class="col-start-0 col-end-1 flex flex-1"
			class:menu={innerWidth < 1000 && $open.open}
			transition:fly={{ duration: 250, x: '-100%', opacity: 1 }}
		>
			<Search>
				<div slot="product" let:product>
					<Product {product} selected={$page.params?.id == product.id}
					on:click={() => {goto(`/dashboard/products/${product.id}`); $open.open = false;}}
					on:mouseover={() => {preloadData(`/dashboard/orphans/${product.id}`)}}
					on:mousedown={() => {preloadData(`/dashboard/orphans/${product.id}`)}}/>
				</div>

				<div slot="header" class="header">
					{#if $open.open}
						<div class="toolbarClose">
							<CloseButton on:click={() => {$open.open = false}}/>
						</div>
					{/if}
				</div>
			</Search>
		</div>
	{/if}
	<slot/>
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
		height: 100%;
	}
	.responsive {
		display: flex;
		flex: 1;
		max-width: 350px;
		min-width: 350px;
		z-index: 40;
		background-color: white;
	}
	@media(max-width: 1000px) {
		.responsive {
			flex: 1;
			align-items: stretch;
			justify-content: stretch;
			width: 100%;
			max-width: 100%;
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
	.header {
		align-items: center;
	}
</style>
