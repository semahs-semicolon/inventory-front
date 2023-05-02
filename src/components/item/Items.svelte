<script>
	import { API_URL, authfetch, imageIdToUrl } from "../../api";

    export let location;

    let items;

    $: {
        if (location?.id != undefined)
        items = authfetch(`${API_URL}/locations/${location?.id}/items`).then(data => data.json());
        // else items= new Promise();
    }
    
    
    const deleteItem = async (id) => {
        const res = await authfetch(`${API_URL}/items/${id}`, {
            method: "DELETE"
        });
        const b = await res.text();

        items = authfetch(`${API_URL}/locations/${location?.id}/items`).then(data => data.json());
    }
</script>

{#if location?.id == undefined}
    <div class="products">
        <div class="header">
            <span>Items</span>
        </div>
        <hr/>

        <div class="content">
            <h3>Select one</h3>
        </div>
    </div>
{:else}
    <div class="products">
        <div class="header">
            <span>Items in .. {location.name} ({location.id})</span>
            <span>Drag to add item</span>
        </div>
        <hr/>

        <div class="content" on:drop={(e) => {
            e.preventDefault();
            const dataStr = e.dataTransfer.getData("seda/product");
            if (dataStr == undefined) return;
            const data = JSON.parse(dataStr);
            const count = parseInt(prompt("count?"));
            

            items = authfetch(`${API_URL}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: data.id,
                    locationId: location.id,
                    count: count
                })
            }).then(a => {
                return authfetch(`${API_URL}/locations/${location?.id}/items`).then(data => data.json());
            })
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
                        <span class="item">
                            <span>{item.count}x</span> 
                            {#if item.product.primaryImage == null}
                            <div class="box image">
                                X
                            </div>
                            {:else}
                            <img class="image" src={imageIdToUrl(item.product.primaryImage)}/>
                            {/if}
                            <a href={`/dashboard/products/${item.product.id}`}>{item.product.name}</a> <button on:click={() => 
                            {
                                if (confirm("u sure?")) deleteItem(item.id)
                            }}>delete</button>
                        </span>
                    </slot>
                {:else}
                    <h3>Welp empty</h3>
                {/each}
            {/await}
        </div>
    </div>
{/if}

<style>
    .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1em;
        align-items: center;
    }
    .image {
        height: 1.5em;
        width: 1.5em;
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
        flex: 1;
        overflow-y: auto;
        gap: 0.5em;
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
