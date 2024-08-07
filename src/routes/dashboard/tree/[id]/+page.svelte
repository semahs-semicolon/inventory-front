<script>
    import {injectParentLink, searchId} from "../../../../utils/treeManipulation";
	import LocationBody from "../../../../components/location3d/LocationBody.svelte";
    export let data;

    let tree;

    let selectedLocation = tree;

    let fullTree;

    const setup = () => {
        fullTree = undefined;
        tree = undefined;
        
        tree = injectParentLink( {...data.tree });
        tree.metadata.x = 0;
        tree.metadata.y = 0;
        tree.metadata.z = 0;
        tree.metadata.rx = 0;
        tree.metadata.ry = 0;
        tree.metadata.rz = 0;
        const fullTree2 = {children: data.fullTree};
        const thing = searchId(fullTree2, tree.id);
        thing.children = tree.children;
        selectedLocation = tree;
        fullTree = fullTree2
    }
    $: data.tree, (()=>{
        setup();
    })();
</script>

<div class="root">
    {#if fullTree != undefined && tree != undefined}
        <LocationBody bind:rootTree={tree} bind:fullTree={fullTree} bind:selectedLocation/>
    {/if}
</div>

<style>
    .root {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>