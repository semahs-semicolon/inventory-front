<script>
    import {injectParentLink, searchId} from "../../../../utils/treeManipulation";
	import LocationBody from "../../../../components/location/LocationBody.svelte";
    export let data;

    let tree;

    let selectedLocation = tree;

    let fullTree = {children: data.fullTree};


    const setup = () => {
        tree = injectParentLink( {...data.tree, x: 0, y: 0, width: 100, height: 100});
        const thing = searchId(fullTree, tree.id);
        thing.children = tree.children;
        selectedLocation = tree;
        fullTree = fullTree;
    }
    $: data.tree, (()=>{
        setup();
    })();
</script>

<div class="root">
    <LocationBody bind:rootTree={tree} bind:fullTree={fullTree} bind:selectedLocation/>
</div>

<style>
    .root {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>