<script>
	import { API_URL, imageIdToUrl } from "../../api";

    export let product;
    export let draggable = false;
    export let selected = false;
</script>


<div class="tree-element" draggable={draggable} class:enabledrag={draggable} on:dragstart={(e) => {
    e.dataTransfer.dropEffect ="move";
    e.dataTransfer.setData("seda/product", JSON.stringify(product));
}} class:selected={selected} on:click on:dblclick>
    <div class="image">
        {#if product.primaryImage != undefined}
            <img src={imageIdToUrl(product.primaryImage,  `${window.devicePixelRatio*32},fit,jpeg`)}/>
        {:else}
            <div class="box">
                X
            </div>
        {/if}
    </div>
    <div class="name">
        <span class="name-str">{product.name} {#if draggable}<a href={`/dashboard/products/${product.id}`}>go</a>{/if}</span>
        <span class="description">{product.description}</span>
    </div>
</div>

<style>

    .box {
        border-color: black;
        border-width: 1px;
        border-style: solid;
        width: 100%; height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tree-element .description {
        color: gray;
        text-overflow: ellipsis;
        height: 1em;
        overflow: hidden;
        display: block;
        width: 200px;
        white-space: nowrap;
    }
    .tree-element .name {
        display: flex;
        flex-direction: column;
    }
    .tree-element .image img {
        width: 2em;
    }
    .tree-element .image {
        display: flex;
        max-height: 100%;
        max-width: 100%;
        width: 2em;
        min-width: 2em;
        max-width: 2em;
        align-items: center;
        justify-content: center;
    }
    .tree-element {
        padding: 0.5em;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        gap: 0.5em;
        max-width: 100%;
        max-height: 100%;
        align-self: stretch;
        min-height: 3em;
        border-radius: 0.5em;
        overflow-x: hidden;
        background-color: white;
    }
    .tree-element:hover {
        background-color: #1D1B2014;
    }
    .tree-element:active {
        background-color: #1D1B201A;
    }
    .selected {
        background-color: #4d9de71A;
    }

    .enabledrag:hover {
        background-color: #4d9de714;
    }
    .enabledrag:active {
        background-color: #4d9de71A;
    }
</style>