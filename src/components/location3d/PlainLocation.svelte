<script>

	import { T } from "@threlte/core";
	import Location3D from "./Location3D.svelte";
	import { createEventDispatcher } from "svelte";
	import { goto } from "$app/navigation";
	import { modelIdToUrl } from "../../api";
	import { GLTF } from "@threlte/extras";

    export let realLocation;
    export let hovered;
    export let selected;
    export let depth;
    export let isRoot = false;

    let evDispatcher = createEventDispatcher();

</script>
<T.Mesh
    position.x = {realLocation.metadata.x} position.y = {realLocation.metadata.z} position.z = {realLocation.metadata.y}
    rotation.x = {realLocation.metadata.rx ?? 0} rotation.y = {realLocation.metadata.rz ?? 0} rotation.z = {realLocation.metadata.ry ?? 0}>
    <Location3D on:click={() => { evDispatcher('selection', realLocation) }} 
        on:dblclick={() => { goto(`/dashboard/tree/${realLocation.id}`) }} 
        bind:location={realLocation} baseColor={
            (hovered == realLocation.id) ? "#b2ce79" :
            (selected == realLocation.id) ? "#69aeae" : "white"
        }>
        {#if isRoot}
            {#if realLocation.metadata.internal}
                <GLTF url={modelIdToUrl(realLocation.metadata.internal)}/>
            {/if}
        {:else}
            {#if realLocation.metadata.external}
                <GLTF url={modelIdToUrl(realLocation.metadata.external)}/>
            {/if}
        {/if}
        

    </Location3D>

    <T.Mesh position.y={0.1}>
        {#if depth > 1}
            {#each realLocation.children as child}
                <svelte:self bind:realLocation={child} id={child.id} depth={depth-1} on:selection {hovered} {selected} isRoot={false}/>
            {/each}
        {/if}
    </T.Mesh>
</T.Mesh>