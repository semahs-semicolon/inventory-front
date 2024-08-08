<script>

	import { T } from "@threlte/core";
	import { Grid, interactivity } from "@threlte/extras";
	import MapControls from "./MapControls.svelte";
	import { Vector3 } from "three";
	import { createEventDispatcher } from "svelte";

    export let locations;

    interactivity();
    let evDispatcher = createEventDispatcher();

    let begin =  [- (locations.metadata.width /2), (locations.metadata.width + locations.metadata.height) / 4, 3 * locations.metadata.height/2];
    $: (locations?.id), (() => {
         begin = [- (locations.metadata.width /2), (locations.metadata.width + locations.metadata.height) / 4, 3 * locations.metadata.height/2]
    })();
</script>
<T.PerspectiveCamera
    makeDefault
    position.x={begin[0]}
    position.y= {begin[1]}
    position.z= {begin[2]}
>
<MapControls enableDamping 
        minPan={new Vector3(0, 0, 0)} maxPan={new Vector3(locations.metadata.width, 0, locations.metadata.height)}
        maxPolarAngle={1.1} minPolarAngle={0.7} 
        maxDistance={700.0} minDistance={50.0} 
        target.x={locations.metadata.width/2} target.z={locations.metadata.height/2}
    />
</T.PerspectiveCamera>


<T.AmbientLight intensity={0.5} />
<T.DirectionalLight intensity={2} position={[0, 10, 0]}/>


<T.Mesh 
on:pointermissed={(e) => {evDispatcher('selection', null)}}>
    <slot location={locations}>
    </slot>
</T.Mesh>

<Grid
position.y={-0.005}
cellColor="#AAAAAA"
sectionColor="#0000ee"
sectionThickness={0}
fadeDistance={400}
cellSize={10}
infiniteGrid={true}
/>