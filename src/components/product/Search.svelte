<script>
	import { API_URL, authfetch } from '../../api.js';
	import { LAST_SEARCH_RESULT } from '../../stores/stores.js';
	import PrimaryButton from '../button/PrimaryButton.svelte';
	import TextField from '../button/TextField.svelte';
	import InfiniteScroll from 'svelte-infinite-scroll';
	import BoxHeader from '../layout/BoxHeader.svelte';

	export let search = '';

	let timeout;
	$: {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			doSearch(search);
		}, 300);
	}

	let lastURL = `${API_URL()}/products?search=${encodeURIComponent(search)}`;
	let page = 0;
	let size = 20;
	let elements = authfetch(`${lastURL}&size=${size}&page=${page}`).then((a) => a.json());

	const doSearch = (search) => {
		lastURL = `${API_URL()}/products?search=${encodeURIComponent(search)}`;
		page = 0;
		elements = authfetch(`${lastURL}&size=${size}&page=${page}`)
			.then((a) => a.json())
			.then((res) => {
				$LAST_SEARCH_RESULT = res;
				return $LAST_SEARCH_RESULT;
			});
	};
	// $: {
	//     if (file == undefined) {
	//         elements = authfetch(`${lastURL}&size=${size}&page=${page}`).then(a => a.json());
	//         elements.then(res => {$LAST_SEARCH_RESULT = res})
	//     }
	// }

	const loadMore = () => {
		if (file == undefined) {
			page += 1;
			elements = authfetch(`${lastURL}&size=${size}&page=${page}`)
				.then((a) => a.json())
				.then((res) => {
					$LAST_SEARCH_RESULT = [...$LAST_SEARCH_RESULT, ...res];
					return $LAST_SEARCH_RESULT;
				});
		}
	};

	let file, src;

	$: {
		if (file != undefined) {
			src = URL.createObjectURL(file[0]);

			$LAST_SEARCH_RESULT = [];
			elements = fetch(`${API_URL()}/embedding/process`, {
				method: 'POST',
				body: file[0]
			})
				.then((a) => a.json())
				.then((a) =>
					authfetch(`${API_URL()}/products/imageSearch`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						body: JSON.stringify({
							size: 10,
							page: 0,
							embedding: a.embedding
						})
					})
				)
				.then((a) => a.json());
			elements.then((res) => {
				$LAST_SEARCH_RESULT = res;
			});
		} else {
			src = null;
		}
	}
</script>

<div class="flex h-full w-full flex-col">
	<BoxHeader>
		<span slot="title">카탈로그</span>
		<div class="flex w-min items-center gap-4" slot="other">
			<div class="relative aspect-[5] h-10">
				<input type="text" on:change {...$$props} placeholder="검색" class="h-full w-full rounded-lg bg-gray-300 px-2" bind:value={search} />
				<label for="file-input" class="absolute right-2 top-0 flex h-full items-center justify-center">
					<span class="material-symbols-outlined text-xl font-medium"> photo_camera </span>
				</label>
			</div>
			<slot name="header" />
			{#if file}
				<button
					class="imgsearch"
					on:click={() => {
						file = undefined;
					}}
				>
					<span class="material-symbols-outlined"> close </span>
				</button>
			{/if}
			<input
				id="file-input"
				type="file"
				capture="environment"
				accept="image/jpeg,image/png,image/gif,image/jpg,image/webp"
				hidden
				bind:files={file}
			/>
		</div>
	</BoxHeader>
	<div class="flex h-full max-h-full flex-col gap-3 overflow-y-auto p-4">
		{#await elements}
			{#each $LAST_SEARCH_RESULT as product}
				<slot {product} name="product">
					<a href={`/dashboard/products/${product.id}`}>{product.name}</a>
				</slot>
			{/each}
			<span>검색중...</span>
		{:then products}
			{#each products as product (product.id)}
				<slot {product} name="product">
					<a href={`/dashboard/products/${product.id}`}>{product.name}</a>
				</slot>
			{/each}
			<InfiniteScroll threshold={10} on:loadMore={loadMore} />
		{/await}
	</div>
</div>
<!--
<style>
	.products {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.content {
		display: flex;
		flex-direction: column;
		padding: 0.5em;
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
-->
