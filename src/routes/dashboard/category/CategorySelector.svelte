<script>
	import { invalidateAll } from "$app/navigation";
	import { goto } from "$app/navigation";
	import { API_URL, authfetch, imageIdToUrl } from "../../../api";
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";
	import TextField from "../../../components/button/TextField.svelte";
	import Product from "../../../components/product/Product.svelte";

    export let category;
    export let childCategories;

    const addCategory = async () => {
        const name = prompt("추가할 카테고리 이름?")
        if (name == undefined) return;
        const res = await authfetch(`${API_URL()}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: name,
                description: "",
                primaryImage: null,
                parentCategoryId: category.categoryId
            })
        });
        const json = await res.json();
        invalidateAll();
    }

    let search = '';
</script>

<div class="wrapper">
    <TextField placeholder="검색어를 입력.." bind:value={search}/>
    <span class="name">
        {#if category.categoryId != null}
            {#if category.parentCategoryId != null}
                <PrimaryButton on:click={() => goto(`/dashboard/category/${category.parentCategoryId}`)}>&lt;</PrimaryButton>
            {:else}
                <PrimaryButton on:click={() => goto(`/dashboard/category`)}>&lt;</PrimaryButton>
            {/if}
        {/if}
        {#if category.primaryImage}
            <div class="imageWrapperContainer">
                <img src={imageIdToUrl(category.primaryImage, "thumbnail")}/>
            </div>
        {/if}
        {category.name}
        <span class="description">
            {category.description}
        </span>
        <span class="splitter"/>
        <slot/>
        {#if category.categoryId != null}
        <PrimaryButton on:click={() => goto(`/dashboard/category/${category.categoryId}/edit`)}>수정</PrimaryButton>
        {/if}
        <PrimaryButton on:click={() => goto(`/dashboard/category/create?parent=${category.categoryId}`)}>+</PrimaryButton>
    </span>
    <hr/>
    <div class="categoryList">
        {#each childCategories.filter(a => a.name.includes(search)).sort((a,b) => a.name.localeCompare(b.name)) as child}
            <a class="category" href="/dashboard/category/{child.categoryId}">
                <div class="imageContainer">
                    {#if child.primaryImage}
                        <img src={imageIdToUrl(child.primaryImage, "thumbnail")}/>
                    {:else}
                        N/A
                    {/if}
                </div>
                
                {child.name}
            </a>
        {/each}
    </div>
    <div class="productList">
        {#each category.products.filter(a => a.name.includes(search)).sort((a,b) => a.name.localeCompare(b.name)) as product}
            <div class="product">
                <Product product={product} on:dblclick={goto(`/dashboard/products/${product.id}`)}/>
            </div>
        {/each}
    </div>
</div>

<style>
    .productList {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
        flex-wrap: wrap;
    }
    .product {
        width: 20em;
    }
    .description {
        font-size: 0.5em;
        color: gray;
    }
    .category {
        text-decoration: none;
        color: black;
        align-items: center;
        display: flex;
        word-break: keep-all;
        flex-direction: column;
        text-align: center;
        gap: 0.5em;
        width: 5em;
    }
    .imageContainer {
        display: flex;
        width: 5em;
        height: 5em;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        object-fit: contain;
        align-items: center;
        justify-content: center;
        background-color: wheat;
        /* border */
    }
    .imageWrapperContainer {
        display: flex;
        width: 2em;
        height: 2em;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        object-fit: contain;
        justify-content: center;
        align-items: center;
        background-color: wheat;
    }
    .imageWrapperContainer img{
        max-width: 100%;
        max-height: 100%;
    }
    .category img {
        max-width: 100%;
        max-height: 100%;
    }
    .categoryList {
        display: flex;
        gap: 0.5em;
        flex-wrap: wrap;
    }

    .splitter {
        display: flex;
        flex: 1;
    }
    .name {
        display: flex;
        font-size: 1.5em;
        gap: 0.5em;
        align-items: end;
    }
    .wrapper {
        display: flex;
        flex: 1;
        gap: 0.5em;
        flex-direction: column;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
    }
</style>