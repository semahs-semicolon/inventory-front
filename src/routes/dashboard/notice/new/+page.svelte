<script>
	import TextArea from "../../../../components/button/TextArea.svelte";
    import TextField from "../../../../components/button/TextField.svelte";

    import { page } from '$app/stores';
	import { API_URL, authfetch } from "../../../../api";
	import { ACCESS_TOKEN } from "../../../../stores";
	import PrimaryButton from "../../../../components/button/PrimaryButton.svelte";
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";
    

    let madeReq = false;


    const create = async () => {
        madeReq = true;
        try {

            const res = await authfetch(`${API_URL()}/notices`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    title: categoryName, content: categoryDesc
                })
            });
            const json = await res.json();
            madeReq = false;
            if (json.id != undefined) {
                history.back();
                goto("/dashboard/notice/"+json.id);
            } else {
                alert(JSON.stringify(json));
            }
        } catch (e) {
            console.log(e);
            madeReq = false;
        }
    }




    let categoryName = '', categoryDesc = '';
</script>

<div class="wrapper">
    <h1>공지 작성하기</h1>
    
    <div class="product_header">
        <div class="name">
            <span>제목</span>
            <TextField type="text" placeholder="제목을 여기에 입력" bind:value={categoryName}/>
        </div>
    </div>
    <span>내용</span>
    <TextArea bind:value={categoryDesc} rows={20}/>

    <PrimaryButton on:click={create}>공지 등록하기</PrimaryButton>
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