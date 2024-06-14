<script>
	import CategorySelector from "../CategorySelector.svelte";

    export let data;
    console.log(data);
</script>

<div class="wrapper">
    <CategorySelector category={data.category} childCategories={data.categories}/>
</div>

<style>
    .wrapper {
        display: flex;
        flex: 1;
        padding: 1em;
        padding-bottom: 0;
    }
</style>