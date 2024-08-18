<script>
	import { API_URL, authfetch } from '../../api.js';
	import { LAST_SEARCH_RESULT } from '../../stores/stores.js';
	import PrimaryButton from '../button/PrimaryButton.svelte';
	import TextField from '../button/TextField.svelte';
	import BoxHeader from '../layout/BoxHeader.svelte';

	export let search = '';

	let lastURL = `${API_URL()}/products/orphans?`;
	let page = 0;
	let size = 10;
	let elements;

	$: {
		elements = authfetch(`${lastURL}size=${size}&page=${page}`).then((a) => a.json());
		elements.then((res) => {
			$LAST_SEARCH_RESULT = res;
		});
	}
</script>

<div class="products">
	<BoxHeader slot="header">
		<span slot="title">분류가 필요한 항목</span>
	</BoxHeader>
	<hr />
	<div class="content">
		{#await elements}
			{#each $LAST_SEARCH_RESULT as product}
				<slot {product} name="product">
					<a href={`/dashboard/products/${product.id}`}>{product.name}</a>
				</slot>
			{/each}
			<span>검색중...</span>
		{:then products}
			{#each products as product}
				<slot {product} name="product">
					<a href={`/dashboard/products/${product.id}`}>{product.name}</a>
				</slot>
			{/each}
			<span class="page">
				<PrimaryButton on:click={() => page--} disabled={page == 0}>이전</PrimaryButton>
				{page + 1} 페이지
				<PrimaryButton on:click={() => page++} disabled={products.length != size}>다음</PrimaryButton>
			</span>
		{/await}
	</div>
</div>

<style>
	.products {
		display: flex;
		flex-direction: column;
		border-width: 1px;
		border-color: black;
		border-style: solid;
		flex: 1;
	}
	.content {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		flex: 1 auto;
		overflow-y: auto;
		background-color: #efefef;
		gap: 0.5em;
		height: 0;
	}
	.header {
		display: flex;
		padding: 0.5em;
		gap: 1em;
		align-items: center;
	}

	hr {
		align-self: stretch;
		flex-direction: column;
		margin: 0;
	}
	.header :global(.grow) {
		flex: 1;
	}
	.page {
		padding: 0.5em;
		justify-content: space-between;
		display: flex;
		align-items: center;
	}
	#file-input {
		display: none;
	}

	.search2,
	input {
		height: 46px;
		border-radius: 16px;
		padding: 16px;
		background-color: #ece6f0;
		border-style: none;
		margin: 0;
		flex: 1;
		display: flex;
		align-items: center;
	}
	input {
		border-radius: 16px 0 0 16px;
	}
	.search2 {
		padding: 0;
	}
	.imgsearch {
		border: none;
		background: none;
		height: 46px;
		width: 46px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 16px;
	}
	.imgsearch:hover {
		background-color: #c793ea;
		box-shadow: 1px 1px 1px #9513eb;
	}
	.imgsearch:active {
		background-color: #c793ea;
		box-shadow: -1px -1px 1px #9513eb;
	}
	.imgimg {
		border: none;
		background: none;
		height: 46px;
		width: 46px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 16px;
	}
	.grow {
		display: flex;
		flex: 1;
	}
</style>
