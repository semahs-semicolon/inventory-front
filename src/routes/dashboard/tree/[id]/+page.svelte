<script>
	import LocationView from "../../../../components/LocationView.svelte";
    import { API_URL, authfetch } from '../../../../api';
	import Products from "../../../../components/product/Products.svelte";
	import TreeView from "../../../../components/TreeView.svelte";
	import Items from "../../../../components/item/Items.svelte";
	import EditableGenericLocationView from "./EditableGenericLocationView.svelte";
    import {injectParentLink} from "../../../../utils/treeManipulation";
	import Product from "../../../../components/product/Product.svelte";
    export let data;

    let tree;

    let selectedLocation = tree;
    let hoveredLocation;

    const setup = () => {
        tree = injectParentLink( {...data.tree, x: 0, y: 0, width: 100});
        selectedLocation = tree;
    }
    $: data.tree, (()=>{
        setup();
    })();


    let editing = false;
</script>

<div class="body">
    <div class="tree">
        <TreeView tree={{children: data.fullTree}} interact={true}>
            <div slot="title" class="treeTitleH">
                <span class="treeTitle">위치 나무</span>
                <a class="treeTitle" href="/dashboard">루트로</a>
            </div>
            <span slot="element" let:element 
                class:hovered={hoveredLocation?.id == element?.id}
                class:selected={selectedLocation?.id == element?.id}
                on:mouseenter={() => hoveredLocation = element}
                on:mouseleave={() => hoveredLocation = null}
            class="tree-element" on:click={(e) => location.href=`/dashboard/tree/${element.id}`}>
                {element?.name}
            </span>
        </TreeView>
    </div>

    <EditableGenericLocationView bind:selectedLocation bind:hoveredLocation bind:rootTree={tree}/>

    <div class="products">
        <Items location={selectedLocation}/>
        <Products>
            <slot slot="product" let:product>
                <Product {product}/>
            </slot>
        </Products>
    </div>
</div>

<style>
    .float-view {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 100;
    }
    .treeTitleH {
        display: flex;
    }
    .treeTitle {
        padding: 0.5em;
    }
    .background {
        width: 100%;
        height: 100%;
    }
    .hovered {
        background-color: coral;
    }
    .selected {
        background-color: darkcyan;
    }
    .tree-element {
        padding: 0.5em;
        cursor: pointer;
    }
    .tree-element:hover {
        background-color: coral;
    }
    .tree {
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        flex-direction: column;
        flex: 1 1;
        max-width: 15em;
        min-width: 10em;
    }
    .body {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        align-self: stretch;
        justify-content: space-around;
        flex-grow: 1;
    }
    .relative {
        position: relative;
        flex-grow: 1;
        overflow: auto;
    }


    .title {
        display: flex;
        padding: 0.5em;
        cursor: pointer;
    }
    .title:hover {
        background-color: coral;
    }
    .title > span {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .draggable {
        cursor: grab;
        background-color: orange;
    }
    .navigatable {
        cursor: pointer;
        background-color: greenyellow;
    }
    .draggable:active {
        cursor: grabbing;
    }
    
    .products {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        max-width: 25em;
        min-width: 20em;
    }

    hr {
        align-self: auto;
        flex-direction: column;
        margin: 0;
    }
</style>