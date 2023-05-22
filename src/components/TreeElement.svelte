<script>
	import { createEventDispatcher } from 'svelte';
	import { scale, slide } from 'svelte/transition';

    export let element;

    let shrunk = false;

    export let interact = false;

</script>

<div class="tree-element">
    <div class="tree-header">
        {#if element.children.length > 0}
            <button on:click={() => shrunk = !shrunk}>
                <span class="material-symbols-outlined animate" class:rotate={shrunk}>
                    expand_more
                </span>
            </button>
        {/if}
        <slot name="element" element={element}>
            <span>{element.name}</span>
        </slot>
    </div>
    {#if !shrunk && element.children.length > 0}
        <div class="line" transition:slide>
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
    .rotate {
        rotate: -90deg;
    }
    .animate {
        transition: rotate 0.5s;
    }
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