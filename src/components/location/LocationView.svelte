<script>
    import { API_URL, authfetch, imageIdToUrl } from '../../api';

	import { createEventDispatcher } from 'svelte';
	import ContextMenu from '../ContextMenu.svelte';

	const dispatch = createEventDispatcher();

    const relScaler = 1;
    const gridWidth = 100;
    const gridHeight = 100;

    export let tree;
    export let parentId;
    export let movable = false;
    export let editing = false;
    export let depth = 2;

    let parentWidth, parentHeight;
    let x, y, width, height;
    
    $: x = tree.x;
    $: y = tree.y;
    $: width = tree.width;
    $: height = tree.height;

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
        if (e.touches) {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
        }

		dragStatus.moving = true;
        dragStatus.sx = e.pageX;
        dragStatus.sy = e.pageY;
        dragStatus.stop = tree.y * parentHeight / gridHeight;
        dragStatus.sleft = tree.x * parentWidth / gridWidth;
	}
    function startResize(e) {
        if (!movable) return;
        if (!editing) return;
        if (e.touches) {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
        }

        resizeStatus.resizing = true;
        resizeStatus.sx = e.pageX;
        resizeStatus.sy = e.pageY;
        resizeStatus.swidth = tree.width * parentWidth / gridWidth;
        resizeStatus.sheight = tree.height * parentHeight / gridHeight;

    }
	
	function keepDrag(e) {
        if (e.touches) {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
        }
		if (dragStatus.moving) {



            let intermediateX = dragStatus.sleft + e.pageX - dragStatus.sx;
			let intermediateY = dragStatus.stop + e.pageY - dragStatus.sy;
            
            tree.x = Math.floor(intermediateX * gridWidth / parentWidth);
            tree.y = Math.floor(intermediateY * gridHeight / parentHeight);
            
            if (tree.x + tree.width > gridWidth) tree.x = gridWidth - tree.width;
            if (tree.y + tree.height > gridHeight) tree.y = gridHeight - tree.height;
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
            tree.height = Math.floor(intermediateHeight * gridHeight / parentHeight);


            if (tree.x + tree.width > gridWidth) tree.width = gridWidth - tree.x;
            if (tree.y + tree.height > gridHeight) tree.height = gridHeight - tree.y;
            
            if (tree.width < 1) tree.width = 1;
            if (tree.height < 1) tree.height = 1;
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

<svelte:window  on:mouseup={endDrag} on:mousemove={keepDrag} on:touchmove={keepDrag}  on:touchend={endDrag}
    on:keydown={keydown} on:keyup={keyup}/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:clientWidth={parentWidth} bind:clientHeight={parentHeight} class="heightgetter"/>
<div class="positioner" style:top={`${y * 100 / gridHeight}%`} style:left={`${x * 100 / gridWidth}%`} style:width={`${width *100/gridWidth}%`} style:height={`${height * 100 / gridHeight}%`}>
        {#if tree.backgroundId != undefined}
            <div class="background2">
                <img src={imageIdToUrl(tree.backgroundId, `${window.devicePixelRatio*Math.max(width /gridWidth * parentWidth, height  / gridHeight * parentHeight)},fit,jpeg`)} alt="background of {tree?.name}"/>
            </div>
        {/if}
        <div class="container">
            <div class="background">
                <slot name="background" tree={tree} startDrag={startDrag}>
                </slot>
            </div>
            {#if depth > 0}
                {#each tree.children as child}
                    <svelte:self tree={child} movable={true} parentId={tree.id} on:dimension editing={editing} depth={depth - 1}>
                        <slot name="background" slot="background" let:tree let:startDrag tree={tree} startDrag={startDrag}/>
                        <slot name="contextmenu" slot="contextmenu" let:tree tree={tree}/>
                    </svelte:self>
                {/each}
            {/if}
        </div>
    {#if movable && editing}
        <div class="resize" on:mousedown={startResize}>
            
        </div>
    {/if}
</div>


<style>
    .heightgetter {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        visibility: hidden;
    }
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
        object-fit: contain;
        opacity: 0.8;
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
        background-color: #FFFFFFBB;
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