<script>
	import { API_URL, authfetch } from "../../../../api";
	import TreeView from "../../../../components/TreeView.svelte";
    import Products from "../../../../components/product/Products.svelte";

    export let data;

    let tree = {
        name: "Root",
        children: data.fullTree
    }


    let productRaw = null;
    let locationRaw = null;

    let count = 1;

    const createItem = async () => {
        await authfetch(`${API_URL()}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: productRaw.id,
                locationId: locationRaw.id,
                count: count
            })
        });

        history.back();
    }
</script>

<div class="container">
    <div class="tree">
        <TreeView tree={tree} interact={true}>
            <span slot="element" let:element class="tree-element" on:click={(e) => locationRaw = element}>
                {element?.name}
            </span>
        </TreeView>
    </div>
    <div class="item">
        <h1>Create new item</h1>
        <input type="text" placeholder="choose location on left panel" disabled value={locationRaw && (`${locationRaw.id} ${locationRaw.name}`)}/>
        <input type="text" placeholder="choose product on right panel" disabled value={productRaw && (`${productRaw.id} ${productRaw.name}`)}/>
        <input type="number" placeholder="count" bind:value={count}/>

        <button on:click={createItem}>Create</button>
    </div>
    <div class="products">
        <Products>
            <slot slot="product" let:product>
                <span class="tree-element" on:click={() => {productRaw = product}}>{product.name}</span>
            </slot>
        </Products>
    </div>
</div>

<style>
    .tree-element {
        padding: 0.5em;
        cursor: pointer;
    }
    .tree {
        width: 10em;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        flex-direction: column;
    }
    .tree-element:hover {
        background-color: #5a8325;
    }
    .container {
        display: flex;
        flex-direction: row;
        gap: 1em;
        flex: 1;
    }
    .item {
        display: flex;
        flex-direction: column;
        flex: 2;
    }
    .products {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>