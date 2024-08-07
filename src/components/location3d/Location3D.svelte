<script>
	import { T } from "@threlte/core";
	import { interactivity, MeshLineGeometry, MeshLineMaterial, Text, TransformControls, useCursor } from "@threlte/extras";
	import { BufferGeometry, Line, LineBasicMaterial, Mesh, Vector3 } from "three";
	import OutlineRenderer from "./OutlineRenderer.svelte";
	import { createEventDispatcher } from "svelte";
	import { base } from "$app/paths";

    export let location;
    export let forceRender = false;
    export let baseColor = "white";

    let plane;

    let arr = new Float32Array(15);
    $: {
        let arr2 = [new Vector3(0,0,0), new Vector3(location.metadata.width, 0, 0), new Vector3(location.metadata.width, location.metadata.height, 0), new Vector3(0, location.metadata.height, 0),new  Vector3(0,0,0)];
        for (let i = 0; i < 5; i++) {
            arr[i * 3 + 0] = arr2[i].x;
            arr[i * 3 + 1] = arr2[i].z;
            arr[i * 3 + 2] = arr2[i].y;
        }
    }

    const {onPointerEnter, onPointerLeave} = useCursor();


    let dispatcher = createEventDispatcher();

    let outline = false;
</script>

{#if location.id != 0 || forceRender}
    <Text text={location.name} position.x = {0} position.z = {0} position.y = {Math.min(location.metadata.width / 2, location.metadata.height / 2, 7.5) + 1} fontSize={Math.min(location.metadata.width / 2, location.metadata.height / 2, 7.5)} color="black"/>
{/if}
<T.Mesh on:click={(ev) => { ev.stopPropagation(); dispatcher('click', ev.detail)}}  on:pointerenter={onPointerEnter} on:pointerleave={onPointerLeave}
        on:dblclick={(ev) => { ev.stopPropagation(); dispatcher('dblclick', ev.detail)}}>
    {#if location.id != 0 || forceRender}
        <T.Mesh bind:ref={plane}
            
            rotation.x={-Math.PI / 2} position.x = {location.metadata.width / 2} position.z= {location.metadata.height / 2} position.y = {0.1}>
            <T.BoxGeometry args={[location.metadata.width  , location.metadata.height , 0.2 ]} />
            <T.MeshStandardMaterial side="DoubleSide" color={baseColor}/>
        </T.Mesh>
        <T.Line position.y = {0.21}>
            <T.BufferGeometry>
                <T.BufferAttribute
                    args={[arr, 3]}
                    attach={(parent, self) => {
                        parent.setAttribute('position', self)
                        return () => {
                        // cleanup function called when ref changes or the component unmounts
                        // https://threlte.xyz/docs/reference/core/t#attach
                        }
                    }}
                />
            </T.BufferGeometry>
            <T.LineBasicMaterial color="#555555"/>
        </T.Line>
    {/if}
    <slot/>
</T.Mesh>
