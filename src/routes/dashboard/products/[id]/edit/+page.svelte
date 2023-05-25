<script>
	import { API_URL, authfetch, imageIdToUrl } from "../../../../../api";


    export let data;

    let productName = data.product.name;
    let productDesc = data.product.description;
    let imageId = data.product.primaryImage;
    const create = async () => {
        let newImageId = imageId;
        if (file != undefined) {
            const formData = new FormData();
            formData.append("image", file[0]);
            const req1 = await authfetch(`${API_URL}/images`, {
                method: 'POST',
                body: formData
            });
            const fileData = await req1.json();
            newImageId = fileData.id;
        }

        const res = await authfetch(`${API_URL}/products/${data.product.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: productName, description: productDesc, imageId: newImageId, parentCategoryId: null
            })
        });
        const json = await res.json();
        history.back();
    }

    let file;
    let src = imageIdToUrl(imageId);
    $: {
        if (file != undefined) {
            src = URL.createObjectURL(file[0]);
        } else
            src = imageIdToUrl(imageId);
    }
</script>

<div class="body">
    <div class="content">
        <div class="header">
            <span>Edit product!</span>&nbsp;
            <a href="javascript:history.back()">Go back</a>
        </div>
        <hr/>
        <div class="real-content">
            <div class="product_header">
                <div class="image">
                    <label for="file-input">
                        {#if src == null}
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
            <h3>Product Desc</h3>
            
            <textarea bind:value={productDesc}/>
            <br/>
            <button on:click={create}>SAVE!</button>
        </div>
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
        flex-grow: 1;
        gap: 0.5em;
    }
    .image {
        width: 5em;
        height: 5em;
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

.body {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        justify-content: stretch;
        align-items: stretch;
    }
    .content {
        display: flex;
        flex-direction: column;
        flex-basis: 2;
        flex-grow: 1;
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
        flex-direction: column;
        padding: 1em;
    }
    hr {
        align-self: auto;
        flex-direction: column;
        margin: 0;
    }
</style>