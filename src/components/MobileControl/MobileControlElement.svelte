<script>
	import { call } from 'three/src/nodes/code/FunctionCallNode.js';

	export let callback;
	export let icon;
	export let title;
	export let toggle;
</script>

{#if toggle}
	<button class="flex flex-1 flex-col items-center justify-center bg-blue-600" on:click={callback}>
		<span class="material-symbols-outlined text-2xl font-semibold text-gray-100">{icon}</span>
		<span class="text-base font-normal text-gray-50">{title}</span>
	</button>
{:else}
	<button class="flex flex-1 flex-col items-center justify-center" on:click={callback}>
		<span class="material-symbols-outlined text-2xl font-semibold text-gray-700">{icon}</span>
		<span class="text-base font-normal text-gray-800">{title}</span>
	</button>
{/if}
