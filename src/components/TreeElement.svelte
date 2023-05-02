<script>
	import { createEventDispatcher } from 'svelte';

    export let element;

    let shrunk = false;

    export let interact = false;

</script>

<div class="tree-element">
    <div class="tree-header">
        {#if element.children.length > 0}
            <button on:click={() => shrunk = !shrunk}>&gt;</button>
        {/if}
        <slot name="element" element={element}>
            <span>{element.name}</span>
        </slot>
    </div>
    {#if !shrunk && element.children.length > 0}
        <div class="line">
            <hr/>
            <div class="tree-children">
                {#each element.children as element}
                    <svelte:self element={element} interact={interact} let:element>        
                        <slot name="element" slot="element" element={element}/>
                    </svelte:self>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .line {
        display: flex;
        flex-direction: row;
        padding-left: 2em;
    }

    .tree-element {
        display: flex;
        flex-direction: column;
    }

    .tree-header {
        display: flex;
        flex-direction: row;
        justify-content: start;
    }
    hr {
        padding: 0;
        margin: 0;
    }

    .tree-children {
        display: flex;
        flex-direction: column;
        align-items: start;
        padding-left: 0.5em;
    }
</style>