<script>
	import { getContext } from 'svelte/internal';
	import { API_URL, authfetch } from '../../../../api.js';
	import { injectParentLink, searchId } from '../../../../utils/treeManipulation.js';
	import { CATEGORIES } from '../../../../stores/stores.js';
	import BoxHeader from '../../../../components/layout/BoxHeader.svelte';
	import Info from '../../../../components/product/Info.svelte';
	import NfcWriter from '../../../../components/nfc/NfcWriter.svelte';
	import { getProductRecord, NFC } from '../../../../utils/NFC.ts';
	const open = getContext('menu-context');

	export let data;

	let writer = false;
	let writeData;
	$: {
		if (data) {
			writeData = getProductRecord(data.product.id);
		}
	}
	const deleteProduct = async () => {
		await authfetch(`${API_URL()}/products/${data.product.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		});
		location.href = '/dashboard';
	};

	let tree = searchId(injectParentLink({ name: 'inv system', children: data.tree }), '0');

	$: {
		selectedItem = undefined;
		data.product.id;
	}

	let visibleTree = tree;
	let route = [];
	let routeIds = [];
	let location = 0;

	const getSpecificLocation = (id) => {
		let theelement = searchId(tree, id);
		let path = [];
		while (theelement?.id != undefined) {
			path = [theelement.name, ...path];
			theelement = theelement.parent;
		}
		return path.join(' > ');
	};

	const setupTreeView = () => {
		let theelement = searchId(tree, selectedItem.locationId);

		route = [];
		routeIds = [];
		while (theelement?.id != undefined) {
			route = [theelement, ...route];
			routeIds = [theelement.id, ...routeIds];
			theelement = theelement.parent;
		}

		location = route.length - 2;
		setupViewOfParent(route[location]);
	};

	const enterLayer = () => {
		if (location >= route.length - 1) return;
		setupViewOfParent(route[++location]);
	};
	const exitLayer = () => {
		if (location < 1) return;
		setupViewOfParent(route[--location]);
	};
	const setupViewOfParent = (parentItem) => {
		visibleTree = {
			name: parentItem.name,
			children: parentItem.children,
			parent: parentItem.parent,
			id: parentItem.id,
			original: parentItem,
			metadata: {
				...parentItem.metadata,
				x: 0,
				y: 0,
				z: 0,
				rx: 0,
				ry: 0,
				rz: 0
			}
		};
	};

	const getCategoryName = (a) => {
		if (a == null) return '';
		const category = $CATEGORIES[a];
		return getCategoryName(category.parentCategoryId) + ' > ' + category.name;
	};

	let selectedItem, hoveredItem;
	let innerHeight, innerWidth;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="body">
	<div class="content">
		<BoxHeader>
			<div slot="other" class="flex items-center">
				{#if $open.should}
					<button
						on:click={() => {
							$open.open = !$open.open;
						}}
					>
						<span class="material-symbols-outlined text-2xl font-medium"> menu </span>
					</button>
				{/if}
			</div>

			<span slot="title">물품 정보</span>
		</BoxHeader>
		{#if NFC.checkCompatibility()}
			<Info {data}>
				<div class="flex items-center justify-between px-2" slot="other">
					<button
						class="rounded-xl bg-[#275eb0] p-3 text-base font-medium text-white"
						on:click={() => {
							writer = true;
						}}>NFC 기록하기</button
					>
				</div>
			</Info>
		{:else}
			<Info {data} />
		{/if}
	</div>
</div>
{#if writer}
	<NfcWriter
		{writeData}
		on:close={() => {
			writer = false;
		}}
	/>
{/if}

<style>
	.storage-list {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		background-color: #efefef;
		padding: 0.5em;
		border-radius: 0.5em;
	}
	.content-header {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-items: baseline;
		gap: 1em;
	}
	.image {
		max-width: 20em;
		max-height: 20em;
		object-fit: contain;
		display: flex;
	}
	@media (max-width: 40em) {
		.image {
			width: 100%;
		}
	}
	.right {
		display: flex;
		flex-direction: column;
	}
	span {
		display: flex;
		align-items: baseline;
		gap: 1em;
	}
	.background {
		width: 100%;
		height: 100%;
	}

	.title {
		display: flex;
		padding: 0.5em;
	}
	.hovered {
		background-color: #b2ce7970;
	}
	.selected {
		background-color: #4d9de770 !important;
	}
	.onroute {
		background-color: #5a83251a;
	}
	.segment-selected {
		background-color: #4d9de770 !important;
	}
	.title > span {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.item {
		display: flex;
		padding: 0.5em;
		cursor: pointer;
		background-color: white;
		border-radius: 0.5em;
	}
	.item:hover {
		background-color: #4d9de714;
	}
	.item:active {
		background-color: #4d9de71a;
	}
	.item-selected {
		background-color: #4d9de71a;
	}
	.body {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		align-items: stretch;
		background-color: white;
		position: relative;
		height: 100%;
	}
	.controls {
		position: absolute;
		display: flex;
		right: 0;
		bottom: 0;
		flex-direction: column;
		align-items: end;
		z-index: 20;
		width: 100%;
	}
	.controls-top {
		display: flex;
		flex-direction: row;
		padding: 1em;
		gap: 1em;
	}
	.route {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		gap: 0.5em;
		background-color: #7777771a;
		padding: 0.5em;
	}
	.segment {
		text-wrap: wrap;
		word-break: break-all;
		overflow-wrap: break-word;
		background-color: white;
		padding: 0.5em;
		border-radius: 0.5em;
	}
	.content {
		display: flex;
		flex-direction: column;
		flex-basis: 2;
		flex: 1;
		height: 100%;
		overflow-y: scroll;
	}
	.header {
		display: flex;
		padding: 0.5em;
		align-items: center;
		gap: 0.5em;
	}
	.real-content {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		padding: 1em;
		gap: 1em;
	}
	.real-content2 {
		display: flex;
		flex-direction: column;
		padding: 1em;
	}

	hr {
		align-self: auto;
		flex-direction: column;
		margin: 0;
	}
	.restTree {
		display: flex;
		flex-basis: 1;
		flex: 1;
	}
	.body {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		align-self: stretch;
		justify-content: space-around;
		flex: 1;
	}
	.relative {
		position: relative;
		flex: 2;
		overflow: auto;
	}

	@media (max-width: 1250px) {
		.relative {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 10;
			background-color: white;
		}
	}
</style>
