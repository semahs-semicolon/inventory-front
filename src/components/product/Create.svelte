<script>
	import { createEventDispatcher } from "svelte";
	import { API_URL, authfetch } from "../../api";
	import PrimaryButton from "../button/PrimaryButton.svelte";
	import TextField from "../button/TextField.svelte";
	import TextArea from "../button/TextArea.svelte";
	import { ACCESS_TOKEN } from "../../stores";
	import { get } from "svelte/store";

    const dispatch = createEventDispatcher();

    export let productName = "";
    export let productDesc = "";


    let fileupload;

    const create = async () => {
        if (madeReq) return;
        madeReq = true;
        try {
            const fileData = await fileupload;

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
            madeReq = false;
            dispatch("productCreation", json);
        } catch (e) {
            madeReq = false;
        }
    }

    let file;
    let src = null;
    let madeReq = false;
    let progress = undefined;
    $: {
        if (file != undefined) {
            src = URL.createObjectURL(file[0]);


            console.log(file);
            fileupload = new Promise((resolve, err) => {
                const formData = new FormData();
                formData.append("image", file[0]);

                let token = get(ACCESS_TOKEN);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", `${API_URL()}/images`, true);
                xhr.setRequestHeader("Authorization", "Bearer "+token)
                xhr.upload.onprogress = function(e) {
                    var percentComplete = Math.ceil((e.loaded / e.total) * 100);
                    progress = percentComplete;
                };

                xhr.onerror = function(e) {
                    progress = undefined;
                    // err(e.)
                }
                xhr.onload = function(e) {
                    progress = undefined;
                    resolve(JSON.parse(xhr.responseText));
                }
                xhr.send(formData);
            });
        } else
            src = null;
    }
</script>

<div class="products">
    <div class="header">
        <span>물품을 카탈로그에 추가</span>
        <slot name="header"/>
    </div>
    <hr/>
    <div class="content">
        {#if progress != undefined}
            <span class="progress">사진 업로딩중... {progress}%</span>
            <progress value={progress} max="100"/>
        {/if}
        <div class="product_header">
            <div class="image">
                <label for="file-input">
                    {#if file == undefined || src == null}
                        <img src="/add_a_photo_outlined.svg" alt="upload"/><br/>
                        <span>사진 첨부</span>
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
        </div>
        <span>물품 설명</span>

        <TextArea bind:value={productDesc} rows="5" placeholder="간략한 물품 설명"/>

        <PrimaryButton on:click={create} disabled={productName == "" || file == null || madeReq} >물품을 카탈로그에 추가하기</PrimaryButton>

    </div>
</div>

<style>
    .progress {
        text-align: center;
        align-self: stretch;
        width: 100%;
    }
    progress {
        display: flex;
        width: 100%;
        border-radius: 0;
        height: 10px;
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
        align-items: center;
        justify-content: space-between;
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
