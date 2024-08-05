<script>
	import { API_URL, authfetch, imageIdToUrl } from "../../api";
	import PrimaryButton from "../button/PrimaryButton.svelte";

    export let location;

    let items;

    $: {
        if (location?.id != undefined)
        items = authfetch(`${API_URL()}/locations/${location?.id}/items`).then(data => data.json());
        // else items= new Promise();
    }


    const changeCount = async (id) => {
        const theItem = (await items).find(a => a.product.id == id) ?? {count: 0};
        let count = parseInt(prompt("추가할 개수를 입력하세요 (현재 개수: "+theItem.count+")"   ));
        if (count == 0 || isNaN(count) || count == undefined) return;
        count += theItem.count;

        let intermediate;
        if (count <= 0) {
            // delete
            intermediate = authfetch(`${API_URL()}/items/${theItem.id}`, {
                method: "DELETE"
            });
        } else if (theItem.count == 0) {
            // create new
            intermediate = authfetch(`${API_URL()}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: id,
                    locationId: location.id,
                    count: count
                })
            })
        } else {
            // set.
            intermediate = authfetch(`${API_URL()}/items/${theItem.id}/count`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    count: count
                })
            })
        }
        items = intermediate.then(a => {
            return authfetch(`${API_URL()}/locations/${location?.id}/items`).then(data => data.json());
        })
    }
</script>
<svelte:window on:current-location-item-update={(e) => {  changeCount(e.detail.id) }}/>


<div class="flex flex-1 flex-col rounded-lg border-4 border-gray-300">
	{#if location?.id == undefined}
		<div class="flex p-2 px-4 text-lg font-medium">
			<span>물품</span>
		</div>
		<div class="content">
			<h3>위치를 선택하세요</h3>
		</div>
	{:else}
		<div class="flex items-center gap-3 p-2 px-4 text-lg font-medium">
			<span>물품 목록: {location.name} ({location.id})</span>
			<span class="text-base font-normal">드래그/더블클릭 통해 추가</span>
		</div>
		<hr />

        <div class="content" on:drop={(e) => {
            e.preventDefault();
            const dataStr = e.dataTransfer.getData("seda/product");
            if (dataStr == undefined) return;
            const data = JSON.parse(dataStr);
            changeCount(data.id);
        }} on:dragover={(ev) => {
            ev.preventDefault();
            if (ev.dataTransfer.types.includes("seda/product")) {
                ev.dataTransfer.dropEffect="copy";
                return true;
            } else {
                ev.dataTransfer.dropEffect="none";
                return false;
            }
        }}>
            {#await items}
                <h1>Loading</h1>
            {:then itemList}
                {#each itemList as item}
                    <slot item={item}>
                        <span class="item" on:click={() => changeCount(item.product.id)}>
                            <span>{item.count}x</span>
                            {#if item.product.primaryImage == null}
                            <div class="box image">
                                X
                            </div>
                            {:else}
                            <img class="image" src={imageIdToUrl(item.product.primaryImage, `60,fit,jpeg`)}/>
                            {/if}
                            <a href={`/dashboard/products/${item.product.id}`} on:click|stopPropagation>{item.product.name}</a>
                        </span>
                    </slot>
                {:else}
                    <span class="howto">카탈로그에서 품목을 더블클릭하거나 드래그해서 물품을 추가하세요</span>
                {/each}
            {/await}
        </div>
<style>
    .howto {
        color: gray;
    }
    .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1em;
        align-items: center;
        padding: 0.5em;
        border-radius: 0.5em;
        background-color: white;
    }
    .image {
        height: 1.5em;
        width: 1.5em;
        object-fit: contain;
    }
    .box {
        border-width: 1px;
        border-color: black;
        border-style: solid;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .item > a {
        flex: 1;
    }
    .item:hover {
        background-color: white;
    }
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
        padding: 0.5em;
        flex: 1 auto;
        overflow-y: auto;
        background-color: #EFEFEF;
        gap: 0.5em;
        height: 0;
    }
    .header {
        display: flex;
        padding: 0.5em;
        gap: 1em;
    }

    hr {
        align-self: stretch;
        flex-direction: column;
        margin: 0;
    }
    .grow {
        flex: 1;
    }
    .page {
        padding: 0.5em;
        justify-content: space-between;
        display: flex;
    }
</style>
