<script>
	import { goto } from "$app/navigation";
	import { API_URL, authfetch } from "../../../../api";
	import PrimaryButton from "../../../../components/button/PrimaryButton.svelte";
	import SecondaryButton from "../../../../components/button/SecondaryButton.svelte";
	import { AUTHORITIES, USER_ID } from "../../../../stores";

    export let data;

    const deleteNotice = async () => {
        if (!confirm("정말로 글을 삭제하시겠습니까?")) return;

        try {

            const res = await authfetch(`${API_URL()}/notices/${data.notice.id}`, {
                method: 'DELETE'
            });
            history.back();
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }
</script>


<div class="tall">
    <div class="wrapper">
        <span class="header">        
            <PrimaryButton on:click={() => history.back()}>&lt;</PrimaryButton>
            <span class="title">
                {data.notice.title}
            </span>

            <span class="author">
                작성자: {data.notice.authorName}
            </span>
            <span class="time">
                글 작성일: {new Date(data.notice.date).toLocaleString('ko')}
            </span>
            {#if $USER_ID == data.notice.author}
                <PrimaryButton on:click={() => {goto(`/dashboard/notice/${data.notice.id}/edit`)}}>글 수정하기</PrimaryButton>
            {/if}
            {#if $USER_ID == data.notice.author || $AUTHORITIES.includes("DELETE_NOTICE")}
                <SecondaryButton on:click={deleteNotice}>글 지우기</SecondaryButton>
            {/if}
        </span>


        <hr/>
        {data.notice.content}
    </div>
</div>

<style>
    .header {
        display: flex;
        align-items: end;
        gap: 0.5em;
    }
    .wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 1em;
        padding-bottom: 0;
        max-width: 1000px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        background-color: #FFFFFF;
    }
    .author {
        color: gray;
    }
    .time {
        color: gray;
    }
    .tall {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex: 1;
    }
    .title {
        font-size: 1.5em;
        gap: 0.5em;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
    }
</style>
