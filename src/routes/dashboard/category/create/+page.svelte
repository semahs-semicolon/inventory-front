<script>
	import TextArea from "../../../../components/button/TextArea.svelte";
    import TextField from "../../../../components/button/TextField.svelte";

    import { page } from '$app/stores';
	import { API_URL, authfetch } from "../../../../api";
	import { ACCESS_TOKEN } from "../../../../stores";
	import PrimaryButton from "../../../../components/button/PrimaryButton.svelte";
	import { get } from "svelte/store";
    
    let parentId;
    $: parentId = $page.url.searchParams.get('parent');
    $: if (parentId != "undefined") parent = authfetch(`${API_URL()}/categories/${parentId}`).then(a => a.json()); else parent = Promise.resolve().then(a => ({name: "루트"})) 




    const create = async () => {
        madeReq = true;
        try {
            let fileData = undefined;
            if (fileupload != null)
                fileData = await fileupload;

            const res = await authfetch(`${API_URL()}/categories`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: categoryName, description: categoryDesc, primaryImage: fileData?.id, parentCategoryId: parentId == "undefined" ? null : parentId
                })
            });
            const json = await res.json();
            madeReq = false;
            history.back();
        } catch (e) {
            console.log(e);
            madeReq = false;
        }
    }


    let fileupload;



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

    let categoryName = '', categoryDesc = '';
</script>

<div class="wrapper">
    <h1>카테고리 추가</h1>
    부모 카테고리: 
    {#await parent}
        로딩중...
    {:then data}
        {data.name}
    {:catch e}
        실패
    {/await}
    {#if progress != undefined}
        <span class="progress">사진 업로딩중... {progress}%</span>
        <progress value={progress} max="100"/>
    {/if}
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

    <PrimaryButton on:click={create}>카테고리 추가하기</PrimaryButton>
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