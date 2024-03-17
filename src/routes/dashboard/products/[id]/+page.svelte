<script>
	import { add_attribute } from 'svelte/internal';
	import { API_URL, authfetch, imageIdToUrl } from '../../../../api.js';
	import LocationView from '../../../../components/location/LocationView.svelte';
	import { injectParentLink, searchId } from '../../../../utils/treeManipulation.js';

    export let data;

    const deleteProduct = async () => {
        await authfetch(`${API_URL()}/products/${data.product.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        });
        location.href = "/dashboard";
    }

    let tree = {
        x: 0,
        y: 0,
        width: 100,
        height: Math.max(...data.tree.map(a => a.y + a.height), 11),
        name: "인벤토리 시스템",
        children: data.tree
    }
    tree = injectParentLink(tree);

    const getSpecificLocation = (id) => {
        let theelement = searchId(tree, id);
        let path = [];
        while (theelement?.id != undefined) {
            path = [theelement.name, ...path];
            theelement = theelement.parent;
        }
        return path.join(" > ")
    }
    
    let selectedItem, hoveredItem;
</script>

<div class="body">
    <div class="content">
        <div class="header">
            <span>Product Details</span>&nbsp;
            <a href="javascript:history.back()">Go back</a>
        </div>
        <hr/>
        <div class="real-content">
            <img class="image" src={imageIdToUrl(data.product.primaryImage)}/>
            <div class="right">
                <div class="content-header">
                    <h1>{data.product.name}</h1>
                    <a href={`/dashboard/products/${data.product.id}/edit`}>Edit</a>
                    <button on:click={deleteProduct} disabled={data.items.length !== 0}>Delete</button>
                </div>
                <p>{data.product.description}</p>
            </div>
        </div>
        <hr/>
        <div class="real-content2">
            <h1>Stored in...</h1>
            {#each data.items as item}
                <span class="item" on:click={() => selectedItem=item}
                    on:mouseenter={() => hoveredItem=item}
                    on:mouseleave={() => hoveredItem=null}>
                    <span>{item.count}x</span><a href={`/dashboard/tree/${item.locationId}`}>{getSpecificLocation(item.locationId)}</a>
                </span>
            {:else}
                <h3>Welp ain't anywhere</h3>
            {/each}
        </div>
    </div>
    {#if selectedItem !== undefined}
        <div class="relative">
            <LocationView tree={tree} movable={false} parentId={null} editing={false}>
                <slot slot="background" let:tree>
                    <div class:hovered={hoveredItem != null && hoveredItem?.locationId == tree?.id}
                    class:selected = {selectedItem != null && selectedItem?.locationId == tree?.id}
                    class="background">
                
                        <div class="title"
                            class:hovered={hoveredItem != undefined && hoveredItem?.locationId == tree?.id}
                            class:selected={selectedItem?.locationId == tree?.id}>
                                <span>{tree.name}</span>
                                <!-- {#if movable && editing}
                                    <button on:click={rename}>rename</button>
                                {/if}
                                {#if movable && editing && tree.children.length == 0}
                                    <button on:click={doDelete}>delete</button>
                            {/if} -->
                        </div>
                    </div>
                </slot>
            </LocationView>
        </div>
    {/if}
</div>

<style>
    .content-header {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: 1em;
    }
    .image {
        width: 20em;
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
        background-color: coral !important;
    }
    .selected {
        background-color: darkcyan !important;
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
        background-color: lightcyan;
    }
    .item:hover {
        background-color: coral;
    }
    .body {
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: stretch;
        align-items: stretch;
    }
    .content {
        display: flex;
        flex-direction: column;
        flex-basis: 2;
        flex: 1;
        border-color: black;
        border-width: 1px;
        border-style: solid;
    }
    .header {
        display: flex;
        padding: 0.5em;
    }
    .real-content {
        display: flex;
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
        flex: 1;
        overflow: auto;
    }

</style>