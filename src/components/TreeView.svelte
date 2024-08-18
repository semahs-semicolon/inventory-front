<script>
	import TreeElement from './TreeElement.svelte';
	import PrimaryButton from './button/PrimaryButton.svelte';

	export let tree;
	export let interact;
</script>

<div class="tree">
	<slot name="header">
		<span class="tree-title">위치 나무</span>
	</slot>
	<div class="tree-contents">
		{#each tree.children as element}
			<TreeElement {element} {interact}>
				<slot name="element" slot="element" let:element {element} />
			</TreeElement>
		{/each}
	</div>
</div>

<style>
	.tree {
		display: flex;
		flex-direction: column;
		align-items: start;
		flex: 1;
		height: 100%;
		background-color: rgb(246, 242, 249);
	}
	.tree-contents {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow-x: auto;
		overflow-y: auto;
		width: 100%;
		height: 100%;
		padding-left: 1em;
		padding-right: 1em;
	}

	hr {
		align-self: stretch;
		flex-direction: column;
		margin: 0;
	}
</style>
