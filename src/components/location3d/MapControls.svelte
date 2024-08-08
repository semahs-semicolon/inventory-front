<script>
    import { forwardEventHandlers, T, useTask, useParent, useThrelte, useThrelteUserContext } from '@threlte/core'
    import {Vector3} from 'three';
  
    import { MapControls as ThreeMapControls } from 'three/addons/controls/MapControls.js'
  
    import { onDestroy } from 'svelte'
	import { writable } from 'svelte/store';
    

  
    const useControlsContext = () => {
        return useThrelteUserContext('threlte-controls', {
            orbitControls: writable(undefined),
            trackballControls: writable(undefined),
            mapControls: writable(undefined)
        })
    }
  
    const parent = useParent()
  
    const isCamera = (p) => {
      return p.isCamera
    }
  
    const { renderer, invalidate } = useThrelte()
  
    if (!isCamera($parent)) {
      throw new Error('Parent missing: <MapControls> need to be a child of a <Camera>')
    }
  
    export const ref = new ThreeMapControls($parent, renderer.domElement)
  
    const { start, stop } = useTask(ref.update, {
      autoStart: false,
      autoInvalidate: false
    })
  
    $: {
      if ($$restProps.autoRotate || $$restProps.enableDamping) start()
      else stop()
    }
  
    const component = forwardEventHandlers()
  
    const { orbitControls } = useControlsContext()
    orbitControls.set(ref)
    onDestroy(() => orbitControls.set(undefined))


    export let minPan = new Vector3( - 2, - 2, - 2 );
    export let maxPan = new Vector3( 22, 22, 22 );
    var _v = new Vector3();
    
    ref.addEventListener("change", function() {
        _v.copy(ref.target);
        ref.target.clamp(minPan, maxPan);
        _v.sub(ref.target);
        $parent.position.sub(_v);
    })
  </script>
  
  <T
    is={ref}
    let:ref
    {...$$restProps}
    bind:this={$component}
    on:change={invalidate}
  >
    <slot {ref} />
  </T>