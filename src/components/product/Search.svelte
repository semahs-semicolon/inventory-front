<script>
	import { API_URL, authfetch } from "../../api";
    import { LAST_SEARCH_RESULT} from '../../stores';
	import PrimaryButton from "../button/PrimaryButton.svelte";
	import TextField from "../button/TextField.svelte";


    export let search = '';

    let timeout;
    $: {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            doSearch(search);
        }, 300);
    }

    let lastURL = `${API_URL()}/products?search=${encodeURIComponent(search)}`;
    let page = 0;
    let size = 10;
    let elements;

    const doSearch = (search) => {
        lastURL = `${API_URL()}/products?search=${encodeURIComponent(search)}`;
        page = 0;
    }
    $: {
        elements = authfetch(`${lastURL}&size=${size}&page=${page}`).then(a => a.json());
        elements.then(res => {$LAST_SEARCH_RESULT = res})
    }
</script>


<div class="products">
    <div class="header">
        <span>카탈로그</span>
        <TextField placeholder="검색" class="grow" bind:value={search}/>
        <slot name="header"/>
    </div>
    <hr/>
    <div class="content">
        {#await elements}

            {#each $LAST_SEARCH_RESULT as product}
                <slot product={product} name="product">
                    <a href={`/dashboard/products/${product.id}`}>{product.name}</a>
                </slot>
            {/each}
            <span>검색중...</span>
        {:then products}
            {#each products as product}
                <slot product={product} name="product">
                    <a href={`/dashboard/products/${product.id}`}>{product.name}</a>
                </slot>
            {/each}
            <span class="page">
                <PrimaryButton on:click={() => page--} disabled={page == 0}>이전</PrimaryButton>
                {page+1} 페이지
                <PrimaryButton on:click={() => page++} disabled={products.length != size}>다음</PrimaryButton>
            </span>
        {/await}
    </div>
</div>

<style>
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
        flex: 1 auto;
        overflow-y: auto;
        background-color: #EFEFEF;
        gap: 0.5em;
        height: 0;
    }
    .header {
        display: flex;
        padding: 0.5em;
        gap: 1em;
        align-items: center;
    }

    hr {
        align-self: stretch;
        flex-direction: column;
        margin: 0;
    }
    .header :global(.grow) {
        flex: 1;
    }
    .page {
        padding: 0.5em;
        justify-content: space-between;
        display: flex;
        align-items: center;
    }
</style>