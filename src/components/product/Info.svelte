<script>
	import { API_URL, authfetch, imageIdToUrl } from '../../api.js';
	import { injectParentLink, searchId } from '../../utils/treeManipulation.js';
	import PrimaryButton from '../../components/button/PrimaryButton.svelte';
	import { goto } from '$app/navigation';
	import ThreeDMap from '../../components/location3d/ThreeDMap.svelte';
	import PlainLocation from '../../routes/dashboard/products/[id]/PlainLocation.svelte';
	export let data;

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
	let selectedItem, hoveredItem;
	let innerHeight, innerWidth;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="content">
	<div class="flex h-fit flex-col gap-4 p-4">
		<img class="max-h-[50vh] object-contain" src={imageIdToUrl(data.product.primaryImage, `webp`)} />
		<hr class="w-full" />
		<div class="flex w-full flex-col gap-2 px-2">
			<div class="flex w-full items-center justify-between">
				<span class="text-2xl font-semibold">{data.product.name}</span>
				<div class="flex items-center gap-4">
					<button on:click={() => goto(`/dashboard/products/${data.product.id}/edit`)} class="material-symbols-outlined text-2xl font-medium"
						>edit</button
					>
					<button on:click={deleteProduct} disabled={data.items.length !== 0} class="material-symbols-outlined text-2xl font-medium">delete</button>
				</div>
			</div>
			<span class="text-base font-normal text-gray-600">{data.product.description}</span>
		</div>
		<hr class="w-full" />
		<div class="flex w-full flex-col gap-2 px-2">
			<span class="text-xl font-medium">저장 위치</span>
			<span class="text-base font-normal text-gray-700">
				총 {data.items.map((a) => a.count).reduce((partialSum, a) => partialSum + a, 0)}개가 {data.items.length}곳에 저장되어 있습니다
			</span>
			<div class="storage-list">
				{#each data.items as item}
					<span
						class="item"
						class:item-selected={selectedItem == item}
						on:click={() => {
							if (selectedItem != item) {
								selectedItem = item;
								setupTreeView();
							} else {
								selectedItem = undefined;
							}
						}}
						on:mouseenter={() => (hoveredItem = item)}
						on:mouseleave={() => (hoveredItem = null)}
					>
						<span>{item.count}x</span><span>{getSpecificLocation(item.locationId)}</span>
					</span>
				{:else}
					<h3>물품이 저장된 곳이 없네요</h3>
				{/each}
			</div>
		</div>
		<slot name="other" />
	</div>
</div>
{#if selectedItem !== undefined}
	<div class="relative">
		<ThreeDMap locations={visibleTree}>
			<PlainLocation
				isRoot={true}
				realLocation={visibleTree}
				depth={3}
				hovered={hoveredItem?.locationId}
				selected={selectedItem?.locationId}
				onroute={routeIds.slice(location + 1)}
			/>
		</ThreeDMap>
		<div class="controls">
			<div class="flex flex-col gap-4 p-4">
				{#if innerWidth < 1250}
					<PrimaryButton on:click={() => (selectedItem = undefined)}>창 종료</PrimaryButton>
				{/if}
				{#if location > 0}
					<PrimaryButton on:click={() => goto(`/dashboard/tree/${routeIds[location - 1]}`)}>메인에서 열기</PrimaryButton>
				{:else}
					<PrimaryButton on:click={() => goto(`/dashboard`)}>메인에서 열기</PrimaryButton>
				{/if}
				<PrimaryButton on:click={() => enterLayer()}>들어가기</PrimaryButton>
				<PrimaryButton on:click={() => exitLayer()}>나가기</PrimaryButton>
			</div>
			<span class="route">
				{#each route as segment}
					<span class="segment" class:segment-selected={segment.id == visibleTree.id}>{segment.name}</span>
					{#if segment !== route[route.length - 1]}
						&gt;
					{/if}
				{/each}
			</span>
		</div>
	</div>
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
