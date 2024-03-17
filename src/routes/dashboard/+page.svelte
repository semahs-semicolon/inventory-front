<script>
	import LocationBody from "../../components/location/LocationBody.svelte";
	import { injectParentLink } from "../../utils/treeManipulation";

    export let data;



    let rootTree = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        name: "인벤토리 시스템",
        children: data.tree
    }
    rootTree = injectParentLink(rootTree)
    console.log(rootTree)
</script>

<div class="root">
   <LocationBody bind:rootTree bind:fullTree={rootTree}/>
</div>

<style>
    .root {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>