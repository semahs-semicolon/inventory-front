<script>
    import { API_URL, authfetch } from '../../api';
	import TreeView from "../TreeView.svelte";
	import Products from "../product/Products.svelte";
	import Items from "../item/Items.svelte";
	import Product from "../product/Product.svelte";
	import { fly } from "svelte/transition";
	import SecondaryButton from "../button/SecondaryButton.svelte";
	import CloseButton from "../button/CloseButton.svelte";
	import { goto } from "$app/navigation";
	import PrimaryButton from "../button/PrimaryButton.svelte";
	import ContextMenu from "../ContextMenu.svelte";
    import ThreeDMap from './ThreeDMap.svelte';
	import PlainLocation from "./PlainLocation.svelte";
    
    export let rootTree;
    export let fullTree;

    let innerWidth = 10000, innerHeight = 10000;

    let selectedLocation, hoveredLocation;

    let treeShow = false;
    let toolbarShow = false;

    const create = async (tree) => {
        const name = prompt("name?");
        const res = await authfetch(`${API_URL()}/locations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: name,
                parent: tree.id,
                metadata: {
                    x: 0,
                    y: 0,
                    z: 0,
                    rx: 0,
                    ry: 0,
                    rz: 0,
                    width: 10,
                    height: 10
                }
            })
        });
        const json = await res.json();
        tree.children = [...tree.children, {...json, children: [], parent: tree}];

        fullTree = fullTree;
        rootTree = rootTree;
    }
    const rename = async (tree) => {
        const name = prompt("name?");
        if (name == null) return;
        const res = await authfetch(`${API_URL()}/locations/${tree.id}/name`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: name
            })
        });
        const json = await res.json();
        tree.name = name;

        fullTree = fullTree;
        rootTree = rootTree;
    }

    const doDelete = async (tree) => {
        if (!confirm("you sure?")) return;
        const res = await authfetch(`${API_URL()}/locations/${tree.id}`, {
            method: "DELETE"
        });
        if (res.status !== 200)
            alert(await res.text());
        else
            tree.parent.children = tree.parent.children.filter(elem => elem.id !== tree.id);

        fullTree = fullTree;
        rootTree = rootTree;
    }
</script>


<svelte:window bind:innerWidth bind:innerHeight />

<div class="body">
    {#if innerWidth >= 1000 || treeShow}
        <div class="tree" class:showHidden={treeShow} transition:fly={{duration: 250, x: '-100%', opacity: 1}}>
            <TreeView tree={fullTree} interact={true}>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div slot="title" class="tree-title-container">
                    <span class="tree-title">위치 나무
                        <PrimaryButton on:click={() => goto("/dashboard/tree/0")}>루트로</PrimaryButton>
                    </span>
                    {#if treeShow}
                        <CloseButton on:click={() => treeShow=false}/>
                    {/if}
                </div>
                <ContextMenu slot="element" let:element>
                    <div slot="menu" class="menu" >
                        <span>{element?.name}</span>
                        <hr/>
                        <PrimaryButton on:click={() => create(element)}>새로 위치 만들기</PrimaryButton>
                        <PrimaryButton on:click={() => rename(element)}>이름 바꾸기</PrimaryButton>
                        <PrimaryButton on:click={() => goto(`/dashboard/tree/${element.id}/edit`)}>편집하기</PrimaryButton>
                        <PrimaryButton on:click={() => doDelete(element)}>삭제하기</PrimaryButton>
                    </div>
                    <span 
                        class:hovered={hoveredLocation?.id == element?.id}
                        class:selected={selectedLocation?.id == element?.id}
                        on:mouseenter={() => hoveredLocation = element}
                        on:mouseleave={() => hoveredLocation = null}
                        class="tree-element" on:click={() => {goto(`/dashboard/tree/${element.id}`); treeShow=false;}}>
                        {element?.name}
                    </span>
                </ContextMenu>
            </TreeView>
        </div>
    {/if}
    {#if (treeShow&& innerWidth < 1000 || toolbarShow&& innerWidth < 700) } 
        <div class="darkbg"/>
    {/if}
    <ThreeDMap locations={rootTree} on:selection={(ev) => {selectedLocation = ev.detail;}}>
        <PlainLocation bind:realLocation={rootTree} depth={3} hovered={hoveredLocation?.id} selected={selectedLocation?.id} on:selection={(ev) => {selectedLocation = ev.detail;}}/>
    </ThreeDMap>
    <div class="collapsibleControl">
        <SecondaryButton class=".toolbar" on:click={() => treeShow = !treeShow}> 위치 트리 </SecondaryButton>
        {#if innerWidth < 700}
            <SecondaryButton on:click={() => toolbarShow = !toolbarShow} disabled={selectedLocation == undefined}>물품 관리</SecondaryButton>
        {/if}
    </div>
    {#if innerWidth >= 700 || toolbarShow}
        <div class="products" class:showHidden={toolbarShow}  transition:fly={{duration: 250, x: '100%', opacity: 1}}>
            {#if toolbarShow}
            <div class="toolbarClose">
                <CloseButton on:click={() => {toolbarShow=false;}}/>
            </div>
            {/if}
            <Items location={selectedLocation}/>
            <Products fullscreen={toolbarShow && innerWidth < 700}>
                <slot slot="product" let:product>
                    <Product {product} draggable={true} on:dblclick={async (e) => {
                        if (selectedLocation.id == undefined) return;
                        window.dispatchEvent(new CustomEvent("current-location-item-update", {detail: {id: product.id}}))
                    }}/>
                </slot>
            </Products>
        </div>
    {/if}
</div>

<style>

.menu {
        display: flex;
        gap: 0.5em;
        flex-direction: column;
    }
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
        z-index: 40;
        background-color: white;
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
        height: 100%;

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
        min-height: 1em;
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
            max-width: 92vw;
            min-width: 92vw;
        }
    }
</style>