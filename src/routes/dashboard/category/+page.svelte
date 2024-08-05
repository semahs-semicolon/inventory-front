<script>
	import { invalidateAll } from "$app/navigation";
	import { invalidate } from "$app/navigation";
	import { goto } from "$app/navigation";
	import { API_URL, authfetch } from "../../../api";
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";
	import SecondaryButton from "../../../components/button/SecondaryButton.svelte";
	import CategorySelector from "./CategorySelector.svelte";

    export let data;
    console.log(data);
    

    // const requestAI = async () => {
    //     const yesorno = confirm("정말로 AI 분류를 시작하시겠습니까?\n\n물품 추가시 AI분류는 기본적으로 자동으로 이루어지며, 이 작업을 시작할 경우, 모든 물품에 대해 AI분류를 다시 수행합니다.")
    //     if (!yesorno) return;

    //     // await authfetch(`${API_URL()}/categories/ai`, {
    //     //     method: "POST"
    //     // });
    //     // invalidateAll();
    //     alert("AI 재분류는 너무 비싸져서 ")
    // }

    // const stopAI = async () => {
    //     const yesorno = confirm("정말로 AI 재분류를 멈추시겠습니까?")
    //     if (!yesorno) return;

    //     await authfetch(`${API_URL()}/categories/ai`, {
    //         method: "DELETE"
    //     });
    //     invalidateAll();
    // }
</script>

<div class="wrapper">
    <CategorySelector category={{
        "category_id": null,
        "name": "카테고리",
        "description": "거대 언어모델이 물품을 분류한 카테고리를 검색합니다",
        "primary_image": null,
        "parent_category_id": null,
        "products": data.products
    }} childCategories={data.categories}>
        <!-- {#if data.ai.running}
        <span>
            재분류중... {data.ai.completed}/{data.ai.total}
        </span>
        {:else if data.ai.total > 0}
        <span>
            재분류 완료! {data.ai.completed}/{data.ai.total}
        </span>
        {/if}
        {#if data.ai.running}
            <SecondaryButton
                on:click={stopAI}>AI 재분류 중지하기</SecondaryButton>
        {:else}
            <PrimaryButton
                on:click={requestAI}>AI 재분류 하기 (~1시간)</PrimaryButton>
        {/if} -->
        <PrimaryButton on:click={() => goto("/dashboard/categoryConfirm")}>최근 추가된 물품</PrimaryButton>
    </CategorySelector>
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 1em;
        padding-bottom: 0;
    }
</style>