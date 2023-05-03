<script>
    import { API_URL, authfetch, imageIdToUrl } from '../api';

	import { createEventDispatcher } from 'svelte';
	import ContextMenu from './ContextMenu.svelte';

	const dispatch = createEventDispatcher();

    const relScaler = 1;
    const gridWidth = 100;

    export let tree;
    export let parentId;
    export let movable = false;
    export let editing = false;

    let parentWidth;

    let x, y, width, height;
    
    $: x = tree.x;
    $: y = tree.y;
    $: width = tree.width;
    $: height = tree.height;


    let minHeight;
    $: minHeight = Math.max(...tree.children.map(a => a.y + a.height));

    const fromRem = (val) => val * parseFloat(getComputedStyle(document.documentElement).fontSize) * relScaler;
    const toRem = (val) => val / parseFloat(getComputedStyle(document.documentElement).fontSize) / relScaler;


    let dragStatus = {
        moving: false,
        sx: 0,
        sy: 0,
        sleft: 0,
        stop: 0
    }
    let resizeStatus = {
        resizing: false,
        sx: 0,
        sy: 0,
        swidth: 0,
        sheight: 0
    }
	
	function startDrag(e) {
        if (!movable) return;
        if (!editing) return;

		dragStatus.moving = true;
        dragStatus.sx = e.pageX;
        dragStatus.sy = e.pageY;
        dragStatus.stop = fromRem(tree.y);
        dragStatus.sleft = tree.x * parentWidth / gridWidth;
	}
    function startResize(e) {
        if (!movable) return;
        if (!editing) return;

        resizeStatus.resizing = true;
        resizeStatus.sx = e.pageX;
        resizeStatus.sy = e.pageY;
        resizeStatus.swidth = tree.width * parentWidth / gridWidth;
        resizeStatus.sheight = fromRem(tree.height);

    }
	
	function keepDrag(e) {
		if (dragStatus.moving) {
			let intermediateX = dragStatus.sleft + e.pageX - dragStatus.sx;
			let intermediateY = dragStatus.stop + e.pageY - dragStatus.sy;
            
            tree.x = Math.floor(intermediateX * gridWidth / parentWidth);
            tree.y = Math.floor(toRem(intermediateY));
            
            if (tree.x + tree.width > gridWidth) tree.x = gridWidth - tree.width;
            if (tree.x < 0) tree.x = 0;
            if (tree.y < 0) tree.y = 0;

            

            dispatch("dimension", {
                locationId: tree.id,
                x: tree.x,
                y: tree.y,
                width: tree.width,
                height: tree.height,
                parentId: parentId
            })
		}
        if (resizeStatus.resizing) {
        
			let intermediateWidth = resizeStatus.swidth + e.pageX - resizeStatus.sx;
			let intermediateHeight = resizeStatus.sheight + e.pageY - resizeStatus.sy;

            tree.width = Math.floor(intermediateWidth * gridWidth / parentWidth);
            tree.height = Math.floor(toRem(intermediateHeight));


            if (tree.x + tree.width > gridWidth) tree.width = gridWidth - tree.x;
            
            if (tree.width < 1) tree.width = 1;
            if (tree.height < 1) tree.height = 1;
            if (tree.height < minHeight) tree.height = minHeight;
            dispatch("dimension", {
                locationId: tree.id,
                x: tree.x,
                y: tree.y,
                width: tree.width,
                height: tree.height,
                parentId: parentId
            })
        }

	}

	function endDrag() {
		dragStatus.moving = false;
        resizeStatus.resizing = false;
	}
    let shift = false;

    function keydown(e) {
        if (e.keyCode == 16) shift = true;
    }
    function keyup(e) {
        if (e.keyCode == 16) shift = false;
    }
</script>

<svelte:window  on:mouseup={endDrag} on:mousemove={keepDrag}
    on:keydown={keydown} on:keyup={keyup}/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:offsetWidth={parentWidth} style:width="100%" style:height="0"/>
    <div class="positioner" style:top={`${y * relScaler}rem`} style:left={`${x * 100 / gridWidth}%`} style:width={`${width *100/gridWidth}%`}>
        {#if tree.backgroundId != undefined}
            <div class="background2">
                <img src={imageIdToUrl(tree.backgroundId)}/>
            </div>
        {/if}
        <div class="container" style:height={`${relScaler*height}rem`}>
            <div class="background">
                <slot name="background" tree={tree} startDrag={startDrag}>
                </slot>
            </div>
            {#each tree.children as child}
                <svelte:self tree={child} movable={true} parentId={tree.id} on:dimension editing={editing}>
                    <slot name="background" slot="background" let:tree let:startDrag tree={tree} startDrag={startDrag}/>
                    <slot name="contextmenu" slot="contextmenu" let:tree tree={tree}/>
                </svelte:self>
            {/each}
        </div>
    {#if movable && editing}
        <div class="resize" on:mousedown={startResize}>
            
        </div>
    {/if}
</div>


<style>
    .background2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .background2 > img {
        width: 100%;
        height: 100%;
    }
    .background {
        position: absolute;
        overflow: auto;
        top: 0;
        left: 0;
        flex: 1;
        align-self: auto;
        width: 100%;
        height: 100%;
    }
    .positioner {
        border-radius: 0;
        border-color: black;
        border-width: 3px;
        border-radius: 3px;
        background-color: white;
        border-style: solid;
        position: absolute;
        display: flex;
        flex-direction: column;
        z-index: 1;
        align-items: stretch;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: white;;
    }
    .resize {
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: se-resize;
        width: 10px;
        height: 10px;
        z-index: 10;
        background-image: url(http://i.imgur.com/hQZDwHs.png);
    }
    .container {
        position: relative;
        overflow: auto;
        flex-grow: 1;
        align-self: auto;
        width: 100%;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>