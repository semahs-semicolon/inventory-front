<script>
    let x, y, show = false;

    const contextMenu = (ev) => {
        ev.preventDefault();
        show = true;
        x = ev.pageX;
        y = ev.pageY;
        console.log(ev);
    }
    const exit = (ev) => {
        show = false;
    }
</script>
<svelte:window on:click={exit}/>

<div on:contextmenu={contextMenu} class="container">
    {#if show}
        <div class="menu" style:left={`${x}px`} style:top={`${y}px`}>
            <slot name="menu"/>
        </div>
    {/if}
    <slot onContextMenu={contextMenu}></slot>
</div>

<style>

    .menu {
        position: fixed;
        display: flex;
        border-radius: 0.5em;
        border-color: black;
        background-color: lightgray;
        color: black;
        border-width: 1px;
        padding: 0.5em;
        z-index: 999;
        border-style: solid;
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