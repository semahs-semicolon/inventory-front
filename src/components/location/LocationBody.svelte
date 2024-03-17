<script>
    import LocationView from "./LocationView.svelte";
    import { API_URL, authfetch } from '../../api';
	import TreeView from "../TreeView.svelte";
	import Products from "../product/Products.svelte";
	import Items from "../item/Items.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import EditableGenericLocationView from "./EditableGenericLocationView.svelte";
	import Product from "../product/Product.svelte";
	import { fly } from "svelte/transition";
	import SecondaryButton from "../button/SecondaryButton.svelte";
	import CloseButton from "../button/CloseButton.svelte";
	import { goto } from "$app/navigation";
    
    export let rootTree;
    export let fullTree;

    export let selectedLocation;
    export let hoveredLocation;

    let treeShow = false;
    let toolbarShow = false;

    let innerWidth = 10000;
    let innerHeight = 10000;
</script>


<svelte:window bind:innerWidth bind:innerHeight />

<div class="body">
    {#if innerWidth >= 1000 || treeShow}
        <div class="tree" class:showHidden={treeShow} transition:fly|local={{duration: 250, x: '-100%', opacity: 1}}>
            <TreeView tree={fullTree} interact={true}>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div slot="title" class="tree-title-container">
                    <span class="tree-title">위치 나무</span>
                    {#if treeShow}
                        <CloseButton on:click={() => treeShow=false}/>
                    {/if}
                </div>
                <span slot="element" let:element 
                    class:hovered={hoveredLocation?.id == element?.id}
                    class:selected={selectedLocation?.id == element?.id}
                    on:mouseenter={() => hoveredLocation = element}
                    on:mouseleave={() => hoveredLocation = null}
                    class="tree-element" on:click={(e) => {goto(`/dashboard/tree/${element.id}`); treeShow=false;}}>
                    {element?.name}
                </span>
            </TreeView>
        </div>
    {/if}
    {#if (treeShow&& innerWidth < 1000 || toolbarShow&& innerWidth < 700) } 
        <div class="darkbg"/>
    {/if}
    <EditableGenericLocationView bind:selectedLocation bind:hoveredLocation bind:rootTree>
        <div class="collapsibleControl">
            <SecondaryButton class=".toolbar" on:click={() => treeShow = !treeShow}> 위치 트리 </SecondaryButton>
            {#if innerWidth < 700}
                <SecondaryButton on:click={() => toolbarShow = !toolbarShow} disabled={selectedLocation == undefined}>물품 관리</SecondaryButton>
            {/if}
        </div>
    </EditableGenericLocationView>
    {#if innerWidth >= 700 || toolbarShow}
        <div class="products" class:showHidden={toolbarShow}  transition:fly|local={{duration: 250, x: '100%', opacity: 1}}>
            {#if toolbarShow}
            <div class="toolbarClose">
                <CloseButton on:click={() => {toolbarShow=false;}}/>
            </div>
            {/if}
            <Items location={selectedLocation}/>
            <Products>
                <slot slot="product" let:product>
                    <Product {product} draggable={true}/>
                </slot>
            </Products>
        </div>
    {/if}
</div>

<style>
    .darkbg {
        z-index: 30;
        background-color: #322F37;
        opacity: 0.4;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .treeClose {
        justify-self: end;
    }
    .tree-title-container {
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-content: space-between;
        padding: 1em;
    }
    .toolbarClose {
        position: absolute;
        left: -2.5em;
        padding: 0.5em;
        justify-content: start;
        width: 100%;
        z-index: 200;
    }
    .toolbarClose > button {
        padding: 0.5em;
    }
    .tree-element {
        padding: 0.5em;
        align-self: center;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        /* align-self: stretch; */
        border-radius: 0.5em;
        opacity: 1;
        overflow-x: hidden;
        transition: all 0.1s;
    }
    .tree-element:hover {
        background-color: #6d972e;
        box-shadow: 3px 3px 3px #5a8325;
    }
    .tree-element:active {
        box-shadow: 0px 0px 0px #5a8325;
    }
    .hovered {
        background-color: #b2ce79;
    }
    .selected {
        background-color: #69aeea;
    }
    .tree {
        display: none;
        align-items: stretch;
        justify-content: stretch;
        flex-direction: column;
        flex: 1 1;
        max-width: 20em;
        min-width: 15em;
        z-index: 40;
        height: 100%;
    }


    .body {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        align-self: stretch;
        justify-content: center;
        flex: 1;
        position: relative;

        box-shadow: 5px 0 5px black, -5px 0 5px black;
    }
    
    .products {
        position: relative;
        display: none;
        flex-direction: column;
        flex: 1;
        max-width: 25em;
        min-width: 20em;
        height: 100%;
        z-index: 20;
        background-color: white;
    }
    .collapsibleControl {
        display: none;
        position: absolute;
        z-index: 5;
        flex-direction: row;
        right: 0;
        justify-content: end;
        gap: 0.5em;
        padding: 0.5em;
    }
    .showHidden {
        display: flex;
        align-items: stretch;
    }
    @media(min-width: 1000px) {
        .tree {
            display: flex;
        }
    }
    @media(max-width: 1000px) {
        .tree {
            position: absolute;
            top: 0;
            left: 0;
            max-width: 80vw;
            min-width: 80vw;
            
            border-top-right-radius: 1em;
            border-bottom-right-radius: 1em;
            overflow: hidden;
        }

        .collapsibleControl {
            display: flex;
            position: absolute;
        }
    }
    @media(min-width: 700px) {
        .products {
            display: flex;
        }
    }
    @media(max-width: 700px) {
        .products {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 40;
        }
    }
</style>