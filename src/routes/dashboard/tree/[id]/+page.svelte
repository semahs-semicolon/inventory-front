<script>
    import {injectParentLink} from "../../../../utils/treeManipulation";
	import LocationBody from "../../../../components/location/LocationBody.svelte";
    export let data;

    let tree;

    let selectedLocation = tree;

    const setup = () => {
        tree = injectParentLink( {...data.tree, x: 0, y: 0, width: 100, height: 100});
        selectedLocation = tree;
    }
    $: data.tree, (()=>{
        setup();
    })();
</script>

<div class="root">
    <LocationBody bind:rootTree={tree} fullTree={{children: data.fullTree}} bind:selectedLocation/>
</div>

<style>
    .root {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>