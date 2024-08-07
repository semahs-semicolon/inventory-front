<script>
	import TextArea from "../../../../../components/button/TextArea.svelte";
    import TextField from "../../../../../components/button/TextField.svelte";

    import { page } from '$app/stores';
	import { API_URL, authfetch, imageIdToUrl } from "../../../../../api";
	import { ACCESS_TOKEN } from "../../../../../stores";
	import PrimaryButton from "../../../../../components/button/PrimaryButton.svelte";
	import { get } from "svelte/store";
	import SecondaryButton from "../../../../../components/button/SecondaryButton.svelte";
	import { goto } from "$app/navigation";

    export let data;
    



    const create = async () => {
        try {
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


            const res = await authfetch(`${API_URL()}/categories/${data.category.categoryId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: categoryName, description: categoryDesc, primaryImage: newImageId
                })
            });
            const json = await res.json();
            history.back();
        } catch (e) {
            console.log(e);
        }
    }


    const deleteCategory = async() => {
        const resp = confirm("진짜로 지울까요?")
        if (!resp) return;

        try {
            let fileData = undefined;
            if (fileupload != null)
                fileData = await fileupload;

            const res = await authfetch(`${API_URL()}/categories/${data.category.categoryId}`, {
                method: 'DELETE'
            });
            history.back();
        } catch (e) {
            console.log(e);
            madeReq = false;
        }

        if (data.category.parentCategoryId != null)
            goto(`/dashboard/category/${data.category.parentCategoryId}`);
        else
            goto(`/dashboard/category`)
    }

    let fileupload;



    let imageId = data.category.primaryImage;

    let file;
    let src;
    if (imageId != null)
        src = imageIdToUrl(imageId, `webp`);
    $: {
        if (file != undefined) {
            src = URL.createObjectURL(file[0]);
        } else if (imageId != null) {
            src = imageIdToUrl(imageId, `webp`)
        } else
            src = null;
    }
    let categoryName = data.category.name, categoryDesc = data.category.description;
</script>

<div class="wrapper">
    <h1>카테고리 수정 <SecondaryButton on:click={deleteCategory}>카테고리 삭제하기</SecondaryButton></h1>
    카테고리 ID: {data.category.categoryId} 
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
            <span>카테고리 이름</span>
            <TextField type="text" placeholder="Type category name" bind:value={categoryName}/>
        </div>
    </div>
    <span>설명</span>
    <TextArea bind:value={categoryDesc}/>

    <PrimaryButton on:click={create}>카테고리 수정하기</PrimaryButton>
</div>


<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        padding: 2em;
        background-color: white;
        width: 100%;
        gap: 0.5em;
    }


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
        object-fit: contain;
    }
    .image img {
        max-width: 100%;
        max-height: 100%;
    }
    .image label {
        width: 5em;
        height: 5em;
        padding: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>