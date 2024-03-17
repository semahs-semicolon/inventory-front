<script>
	import { onMount } from "svelte";
    import {polyfill} from "mobile-drag-drop";

    import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour";

    onMount(() => {
        polyfill({
            // use this to make use of the scroll behaviour
            dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
        });
    })
</script>

<slot/>