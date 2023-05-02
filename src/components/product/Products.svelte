<script>
	import { API_URL, authfetch } from "../../api";
	import Create from "./Create.svelte";
	import Search from "./Search.svelte";

    let creating = false;

    let name = '';
</script>

{#if creating}
    <Create bind:productName={name} on:productCreation={(js) => {creating=false;}}>
        <slot slot="header">
            <button on:click={() => creating=false}>search</button>
        </slot>
    </Create>
{:else}
    <Search bind:search={name}>
        <slot slot="header">
            <button on:click={() => creating=true}>new</button>
        </slot>
        <slot slot="product" name="product" let:product product={product}>
            <a href={`/dashboard/products/${product.id}`}>{product.name}</a>
        </slot>
    </Search>
{/if}

