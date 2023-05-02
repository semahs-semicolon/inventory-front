<script>
    import TreeElement from "./TreeElement.svelte";

    export let tree;
    export let interact;

</script>

<div class="tree">
    <slot name="title">
        <span class="title">위치 나무</span>
    </slot>
    <hr/>
    <div class="tree-contents">
        {#each tree.children as element}
            <TreeElement element={element} interact={interact} let:element>
                <slot name="element" slot="element" element={element}/>
            </TreeElement>
        {/each}
    </div>
</div>

<style>
    .tree {
        display: flex;
        flex-direction: column;
        align-items: start;
        overflow-x: auto;
        overflow-y: auto;
        flex-grow: 1;
        border-width: 1px;
        border-color: black;
        border-style: solid;
    }
    .tree-contents {
        display: flex;
        flex-direction: column;
        padding: 0.5em;
    }

    hr {
        align-self: stretch;
        flex-direction: column;
        margin: 0;
    }
    .title {
        padding: 0.5em;
    }
</style>