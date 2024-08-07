<script>
    import {T} from '@threlte/core';
    import { Grid, Text } from '@threlte/extras';
    import { Canvas } from '@threlte/core'
	import MapControls from './MapControls.svelte';
	import { Mesh, PlaneGeometry, Vector3 } from 'three';
	import Location3D from './Location3D.svelte';
	import ThreeDMapScene from './ThreeDMapScene.svelte';
	import { createEventDispatcher } from 'svelte';

    export let locations;

    console.log(locations);

    // interactivity();
</script>


<div class="map">
    <Canvas>


       <ThreeDMapScene locations={locations} let:location on:selection>
            <slot location={location}/>
       </ThreeDMapScene>


    </Canvas>
</div>



<style>
    .map {
        position: relative;
        flex: 1;
        overflow: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;
        height: 100%;
        /* background-color: ; */
    }
</style>