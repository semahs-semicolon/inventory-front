<script>
	import { getContext } from "svelte";

    let popup = getContext('popup')

    let x, y;

    const contextMenu = (ev) => {
        ev.preventDefault();
        x = ev.pageX;
        y = ev.pageY;
        console.log(ev);

        $popup = {
            x: x,
            y: y,
            htmlDomElem: menuEl
        };
    }
    const exit = (ev) => {
        $popup = undefined;
    }

    let menuEl;
</script>
<svelte:window on:click={exit}/>

<div class="invisible">
    <div class="um" bind:this={menuEl}>
        <slot name="menu"/>
    </div>
</div>

<div class="container" on:contextmenu={contextMenu}>
    <slot onContextMenu={contextMenu}></slot>
</div>

<style>
    .invisible {
        display: none;
    }
    .menu {
        position: fixed;
        display: flex;
        border-radius: 1em;
        border-color: black;
        background-color: #EFEFEF;
        color: black;
        border-width: 1px;
        padding: 1em;
        z-index: 999;
        border-style: solid;
        max-width: 300px;
    }
    .container {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        align-items: stretch;
        justify-content: stretch;
    }
</style>