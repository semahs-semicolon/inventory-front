<script>
	import InfiniteScroll from 'svelte-infinite-scroll';
	import { API_URL, authfetch, imageIdToUrl } from '../../../api';
    import PrimaryButton from '../../../components/button/PrimaryButton.svelte';
    import TextField from '../../../components/button/TextField.svelte';
    import SecondaryButton from '../../../components/button/SecondaryButton.svelte';
	import Product from '../../../components/product/Product.svelte';
    import { goto } from '$app/navigation'

    export let data;

    let categories = {}
    $: {
        for (const category of data.categories) {
            categories[category.categoryId] = category;
        }
    }


    let lastSearchResult = [];

    let lastURL = `${API_URL()}/products/noconfirm`;
    let page = 0;
    let size = 100;
    let elements =  authfetch(`${lastURL}?size=${size}&page=${page}`).then(a => a.json()).then(a => lastSearchResult = a);

    const loadMore = () => {
        // I'm aware this causes bug. I'd say just refresh your page.
            page += 1;
            elements = authfetch(`${lastURL}?size=${size}&page=${page}`).then(a => a.json())
            .then(res => {
                lastSearchResult = [...lastSearchResult, ...res]
                    .filter((obj1, i, arr) => arr.findIndex(obj2 => (obj2.id === obj1.id)) === i); 
            return lastSearchResult})
        
    }
    $: {
        console.log(lastSearchResult)
    }

    const getName = (a) => {
        if (a == null) return ""
        const category = categories[a];
        return getName(category.parentCategoryId) + " > " + category.name;
    }

    let selected;

    const applyAndNext = async () => {
        await authfetch(`${API_URL()}/products/${selected.id}/review`, {
            method: "POST",
            body: JSON.stringify({
                categoryId: selected.categoryId
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
        selected.categoryAccepted =true;

        next();

    }
    const previous = () => {
        const idx = lastSearchResult.indexOf(selected);
        if (idx > 0) {
            selected = lastSearchResult[idx-1];
            search = '';
        }
    }
    const next = () => {

        const idx = lastSearchResult.indexOf(selected);
        if (idx + 1 < lastSearchResult.length) {
            selected = lastSearchResult[idx+1];
            search = '';
        }
    }

    const change = (c) => {
        selected.categoryId = c.categoryId;
    }

    let search = '';
</script>

<div class="wrapper">
    <h1>최근 추가되거나 AI통해 카테고리 업데이트되었지만 리뷰되지 않은 물품</h1>
    <hr/>
        <div class="workingarea">
            <div class="productList">
                {#each lastSearchResult as product (product.id)}
                    <Product product={product} name="product" on:click={ () => {selected = product;}}/>
                {/each}
                <InfiniteScroll threshold={100} on:loadMore={loadMore}/>
            </div>
            <hr/>
            {#if selected != null}
            <div class="imageandproduct">
                <img fetchPriority = "high" class="image" src={imageIdToUrl(selected?.primaryImage, `webp`)}/>
                <div class="product">
                    <PrimaryButton on:click={() => {goto(`/dashboard/products/${selected.id}`)}}>물품으로 이동하기</PrimaryButton>
                    <span>물품명: {selected?.name}</span>
                    <span>설명: {selected?.description}</span>
                    <span>분류된 카테고리: {getName(selected?.categoryId)}</span>
                    <span>리뷰함: {selected.categoryAccepted}</span>
                    <div class="actions">
                        <PrimaryButton on:click={previous}>돌아가기</PrimaryButton>
                        <PrimaryButton on:click={applyAndNext}>적용하기</PrimaryButton>
                        <PrimaryButton on:click={next}>스킵하기</PrimaryButton>
                    </div>

                    <TextField placeholder="검색" bind:value={search}/>
                    <div class="categories">
                        {#each data.categories.filter(a => a.name.includes(search)) as category}
                            <SecondaryButton on:click={() => change(category)}>{getName(category.categoryId)}</SecondaryButton>
                        {/each}
                    </div>
                </div>
            </div>
            {/if}
        </div>
</div>
<hr/>

<style>
    .wrapper {
        padding: 1em;
        gap: 0.5em;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .productList {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        width: 20em;
        overflow: auto;
    }

    .categories {
        gap: 0.5em;
        display: flex;
        flex-wrap: wrap;
    }
    .image {
        width: 20em;
        object-fit: contain;
        display: flex;
        align-self: flex-start;
    }
    .product {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 1em;
        background-color: white;
        padding: 1em;
        border-radius: 1em;
        min-width: 10em;
    }
    .workingarea {
        display: flex;
        flex: 1;
        height: 0%;
        gap: 1em;
    }
    .imageandproduct {
        display: flex;
        flex: 10;
        flex-wrap: wrap;
        gap: 1em;
        overflow-y: auto;
    }
    hr {
        margin: 0;
    }
</style>