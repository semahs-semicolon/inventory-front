<script>
	import LocationView from "../../components/LocationView.svelte";
    import { API_URL, authfetch } from '../../api';
	import TreeView from "../../components/TreeView.svelte";
	import Products from "../../components/product/Products.svelte";
	import Items from "../../components/item/Items.svelte";
	import ContextMenu from "../../components/ContextMenu.svelte";
	import EditableGenericLocationView from "./tree/[id]/EditableGenericLocationView.svelte";
	import { injectParentLink } from "../../utils/treeManipulation";
	import Product from "../../components/product/Product.svelte";
    
    export let data;
    

    let rootTree = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        name: "인벤토리 시스템",
        children: data.tree
    }
    rootTree = injectParentLink(rootTree)
    console.log(rootTree);

    let selectedLocation;
    let hoveredLocation;

    let treeShow = false;
    let toolbarShow = false;
</script>

<div class="collapsibleControl">
    <button on:click={() => treeShow = !treeShow}>Tree</button>
    <button on:click={() => toolbarShow = !toolbarShow}>Toolbar</button>
</div>
<div class="body">
    <div class="tree" class:showHidden={treeShow}>
        <TreeView tree={rootTree} interact={true}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    <EditableGenericLocationView bind:selectedLocation bind:hoveredLocation bind:rootTree/>
    <div class="products" class:showHidden={toolbarShow}>
        <Items location={selectedLocation}/>
        <Products>
            <slot slot="product" let:product>
                <Product {product}/>
            </slot>
        </Products>
    </div>
</div>

<style>
    .tree-element {
        padding: 0.5em;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        gap: 0.5em;
        max-width: 100%;
        max-height: 100%;
        align-self: stretch;
        overflow-x: hidden;
    }
    .tree-element:hover {
        background-color: coral;
    }
    .hovered {
        background-color: coral;
    }
    .selected {
        background-color: darkcyan;
    }
    .tree {
        display: none;
        align-items: stretch;
        justify-content: stretch;
        flex-direction: column;
        flex: 1 1;
        max-width: 15em;
        min-width: 10em;
        z-index: 10;
        height: 100%;
        background-color: white;
    }
    .body {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        align-self: stretch;
        justify-content: space-around;
        flex-grow: 1;
        position: relative;
    }
    
    .products {
        display: none;
        flex-direction: column;
        flex-grow: 1;
        max-width: 25em;
        min-width: 20em;
        height: 100%;
        z-index: 10;
        background-color: white;
    }
    .collapsibleControl {
        display: none;
    }
    .showHidden {
        display: flex;
    }
    @media(min-width: 1000px) {
        .tree {
            display: flex;
        }
        .products {
            display: flex;
        }
    }
    @media(max-width: 1000px) {
        .tree {
            position: absolute;
            top: 0;
            left: 0;
        }
        .products {
            position: absolute;
            top: 0;
            right: 0;
        }
        .collapsibleControl {
            display: flex;
            justify-content: space-between;
        }
    }
</style>