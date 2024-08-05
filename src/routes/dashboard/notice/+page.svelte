<script>
	import { preloadData } from "$app/navigation";
	import { goto } from "$app/navigation";
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";
    import Footer from "../../../components/Footer.svelte";
	import { AUTHORITIES } from "../../../stores";

    export let data;
</script>


<div class="tall">
    <div class="wrapper">
        <span class="title">공지

            {#if $AUTHORITIES.includes("CREATE_NOTICE")}
            <PrimaryButton on:click={() => {goto("/dashboard/notice/new")}}>글 쓰기</PrimaryButton>
            {/if}
        </span>
        <hr/>
        {#each data.notices as notice}
            <div class="notice" on:click={() => goto(`/dashboard/notice/${notice.id}`)} on:mouseover={() => preloadData(`/dashboard/notice/${notice.id}`)}>
                <span class="header">
                    <span class="title">{notice.title}</span>
                    <span class="author">{notice.authorName}</span>
                    <span class="date">{new Date(notice.date).toLocaleDateString('ko')}</span>
                </span>

                <span class="content">{notice.content}</span>
            </div>
        {/each}
    </div>
<Footer/>
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        align-items: end;
        padding-bottom: 0.5em;
        gap: 0.5em;
    }
    .notice {
        display: flex;
        flex-direction: column;;
        padding: 1em;
        border-color: #DEDEDE;
        border-style: solid;
        border-radius: 0.5em;
        border-width: 1px;
        cursor: pointer;
    }
    .notice:hover {
        background-color: #EEEEEE;
    }
    .notice:active {
        background-color: #DEDEDE;
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
        gap: 1em;
    }
    .tall {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex: 1;
    }
    .title {
        display: flex;
        font-size: 1.5em;
        gap: 0.5em;
        justify-content: space-between;
    }
    .content {
        color: gray;
    }
    .date {
        color: gray;
    }
    .author {
        color: gray;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
    }
</style>
