<script>
	import { goto } from "$app/navigation";
import { API_URL, authfetch, imageIdToUrl } from "../../../../../api";
	import PrimaryButton from "../../../../../components/button/PrimaryButton.svelte";
	import TextArea from "../../../../../components/button/TextArea.svelte";
	import TextField from "../../../../../components/button/TextField.svelte";
	import { CATEGORIES } from "../../../../../stores";


    export let data;

    let productName = data.product.name;
    let productDesc = data.product.description;
    let imageId = data.product.primaryImage;

    let newCategory = data.product.categoryId?.toString();
    const create = async () => {
        let newImageId = imageId;
        if (file != undefined) {
            const formData = new FormData();
            formData.append("image", file[0]);
            const req1 = await authfetch(`${API_URL()}/images`, {
                method: 'POST',
                body: formData
            });
            const fileData = await req1.json();
            newImageId = fileData.id;
        }

        const res = await authfetch(`${API_URL()}/products/${data.product.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: productName, description: productDesc, imageId: newImageId, parentCategoryId: null
            })
        });
        const json = await res.json();

        if (newCategory != data.product.parentCategoryId) {
            const res = await authfetch(`${API_URL()}/products/${data.product.id}/review`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    categoryId: newCategory == "null" ? null : newCategory
                })
            });
            const json = await res.json();
        }
        

        history.back();
    }


    const getCategoryName = (a) => {
        if (a == null) return ""
        const category = $CATEGORIES[a];
        return getCategoryName(category.parentCategoryId) + " > " + category.name;
    }

    let file;
    let src = imageIdToUrl(imageId, `webp`);
    $: {
        if (file != undefined) {
            src = URL.createObjectURL(file[0]);
        } else
            src = imageIdToUrl(imageId, `webp`);
    }
</script>

<div class="body">
    <div class="content">
        <div class="header">
            <PrimaryButton on:click={() => history.back()}>돌아가기</PrimaryButton>
            <span>물품 수정</span>
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
                    <input id="file-input" type="file" capture="environment" accept="image/jpeg,image/png,image/gif,image/jpg,image/webp" hidden bind:files={file}/>
                </div>
                <div class="name">
                    <span>물품 이름</span>
                    <TextField type="text" placeholder="Type product name" bind:value={productName}/>
                </div>
            </div><br/>
            <span>물품 설명</span> <br/>
            
            <TextArea bind:value={productDesc} rows=20/>
            <br/>

            <span>카테고리 변경</span><br/>
            <select bind:value={newCategory}>

                <option value="null">없음</option>
                {#each data.categories  as category}
                    <option value={category.categoryId}>{getCategoryName(category.categoryId)}</option>
                {/each}
            </select>
            <br/>

            <PrimaryButton on:click={create}>저장!</PrimaryButton>
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
        flex: 1;
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
        flex: 1;
        justify-content: stretch;
        align-items: stretch;
        background-color: white;
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
        align-items: center;
        gap: 0.5em;
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