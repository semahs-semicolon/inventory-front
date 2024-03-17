<script>
	import { createEventDispatcher } from "svelte";
	import { API_URL, authfetch } from "../../api";

    const dispatch = createEventDispatcher();

    export let productName = "";
    export let productDesc = "";

    const create = async () => {
        const formData = new FormData();
        formData.append("image", file[0]);
        const req1 = await authfetch(`${API_URL()}/images`, {
            method: 'POST',
            body: formData
        });
        const fileData = await req1.json();

        const res = await authfetch(`${API_URL()}/products`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: productName, description: productDesc, imageId: fileData.id, parentCategoryId: null
            })
        });
        const json = await res.json();
        dispatch("productCreation", json);
    }

    let file;
    let src = null;
    $: {
        if (file != undefined) {
            src = URL.createObjectURL(file[0]);
        } else
            src = null;
    }
</script>

<div class="products">
    <div class="header">
        <span>Create New</span>
        <slot name="header"/>
    </div>
    <hr/>
    <div class="content">
        <div class="product_header">
            <div class="image">
                <label for="file-input">
                    {#if file == undefined || src == null}
                        <img src="/add_a_photo_outlined.svg" alt="upload"/>
                    {:else}
                        <img src={src} alt="uploaded"/>
                    {/if}
                </label>
                <input id="file-input" type="file" accept="image/jpeg,image/png,image/gif,image/jpg,image/webp" hidden bind:files={file}/>
            </div>
            <div class="name">
                <span>Product name</span>
                <input type="text" placeholder="Type product name" bind:value={productName}>
            </div>
        </div>
        <span>Product Desc</span>

        <textarea bind:value={productDesc}/>

        <button on:click={create} disabled={productName == "" || file == null}>SAVE!</button>

    </div>
</div>

<style>
    .product_header {
        display: flex;
        flex-direction: row;
        align-items: auto;
        gap: 0.5em;
    }
    .name {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5em;
    }
    .image {
        width: 3em;
        height: 3em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-color: black;
        border-style: solid;
        border-width: 1px;
    }
    .image img {
        max-width: 100%;
        max-height: 100%;
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
