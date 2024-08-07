<script>
	import { T } from "@threlte/core";
	import Location3D from "../../../../../components/location3d/Location3D.svelte";
	import { Text, TransformControls } from "@threlte/extras";
	import { searchId } from "../../../../../utils/treeManipulation";
	import { createEventDispatcher } from "svelte";
	import { Vector3 } from "three";
	import Portal from "svelte-portal";
	import PrimaryButton from "../../../../../components/button/PrimaryButton.svelte";

    export let location;
    export let id;
    export let depth;


    export let selectedId;

    let realLocation = searchId($location, id);

    let evDispatcher = createEventDispatcher();
    let controls;
    $: {
        console.log(controls);
        // controls.on
        // if (controls != undefined)
        // controls.setMode('rotate')
    }

    const onKeypress = (ev) => {
        if (controls == undefined) return;
        if (ev.key == 'r') {
            controls.setMode('rotate');
        } else if (ev.key == 't') {
            controls.setMode('translate');
        }
    }

    const onUpdate = (ev) => {
        if (selectedId != $location.id) {
            realLocation.metadata.x = meshTranslation.position.x;
            realLocation.metadata.y = meshTranslation.position.z;
            realLocation.metadata.z = meshTranslation.position.y;

            realLocation.metadata.rx = meshTranslation.rotation.x;
            realLocation.metadata.ry = meshTranslation.rotation.z;
            realLocation.metadata.rz = meshTranslation.rotation.y;
        }
        realLocation.metadata.width = Math.max(0.3, meshResize.position.x);
        realLocation.metadata.height = Math.max(0.3, meshResize.position.z);
        realLocation = realLocation;
        $location = $location;

    }

    $: {
        if (realLocation.metadata.width < 0.3) realLocation.metadata.width = 0.3;
        if (realLocation.metadata.height < 0.3) realLocation.metadata.height = 0.3;
    }

    let meshTranslation;
    let meshResize;
</script>
<svelte:window on:keypress={onKeypress}/>

<T.Mesh bind:ref={meshTranslation} 
    position.x = {realLocation.metadata.x} position.y = {realLocation.metadata.z} position.z = {realLocation.metadata.y}
    rotation.x = {realLocation.metadata.rx ?? 0} rotation.y = {realLocation.metadata.rz ?? 0} rotation.z = {realLocation.metadata.ry ?? 0}>
    <Location3D on:click={() => { evDispatcher('selection', realLocation.id); }} location={realLocation} forceRender>

    </Location3D>

    {#if selectedId == realLocation.id}
        {#if selectedId != $location.id}
            <TransformControls object={meshTranslation} bind:controls={controls} on:change={onUpdate} translationSnap="0.1" rotationSnap={Math.PI / 4}/>
        {/if}

        <T.Mesh bind:ref={meshResize} let:ref={meshResize} position.x = {realLocation.metadata.width} position.y = "0.3" position.z = {realLocation.metadata.height}>
            <T.BoxGeometry args={[0.2, 0.2, 0.2]} />
            <T.MeshStandardMaterial side="DoubleSide" color="yellow"/>
            <TransformControls object={meshResize}   showY={false} on:change={onUpdate} translationSnap="0.1" space="local" />
        </T.Mesh>
    
    {/if}

    <T.Mesh position.y={0.1}>
        {#if depth > 1}
            {#each realLocation.children as child}
                <svelte:self {location} id={child.id} depth={depth-1} on:selection {selectedId}/>
            {/each}
        {/if}
    </T.Mesh>
</T.Mesh>

{#if selectedId == realLocation.id}
    <Portal target="#control-attrib">
        <div class="attriblist">
            <span class="attrib">선택됨: <input bind:value={realLocation.name}/></span>
            {#if selectedId != $location.id}
                <h3>위치</h3>
                <span class="attrib">X: <input type="number" bind:value={realLocation.metadata.x}/></span>
                <span class="attrib">Y: <input type="number" bind:value={realLocation.metadata.y}/></span>
                <span class="attrib">Z: <input type="number" bind:value={realLocation.metadata.z}/></span>
                <hr/>
                <h3>회전</h3>
                <span class="attrib">Rot X: <input type="number" bind:value={realLocation.metadata.rx}/></span>
                <span class="attrib">Rot Y: <input type="number" bind:value={realLocation.metadata.ry}/></span>
                <span class="attrib">Rot Z: <input type="number" bind:value={realLocation.metadata.rz}/></span>
                <hr/>
            {/if}
            <h3>크기</h3>
            <span class="attrib">Width: <input type="number" bind:value={realLocation.metadata.width}/></span>
            <span class="attrib">Height: <input type="number" bind:value={realLocation.metadata.height}/></span>
            <hr/>
            {#if selectedId != $location.id}
                <h3>외부 구조물</h3>
            {:else}
                <PrimaryButton>위치 추가</PrimaryButton>
                <hr/>
                <h3>내부 구조물</h3>
            {/if}
        </div>
    </Portal>
{/if}
<style>
    .attriblist {
        display: flex;
        flex-direction: column;
        padding: 0.5em;
    }
    .attrib {
        display: flex;

    }
    hr {
        margin-left: 0;
        margin-right: 0;
    }
</style>