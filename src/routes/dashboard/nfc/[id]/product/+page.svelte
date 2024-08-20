<script>
	import CenterAlign from '../../../../../components/layout/CenterAlign.svelte';
	import BoxHeader from '../../../../../components/layout/BoxHeader.svelte';
	import Info from '../../../../../components/product/Info.svelte';
	import NfcWriter from '../../../../../components/nfc/NfcWriter.svelte';
	import NfcClear from '../../../../../components/nfc/NfcClear.svelte';
	import { getProductRecord } from '../../../../../utils/NFC.ts';
	export let data;
	let writeData;
	$: {
		if (data) {
			writeData = getProductRecord(data.product.id);
		}
	}
	let writer = false;
	let eraser = false;
</script>

<CenterAlign>
	<div class="absolute left-0 top-0 flex w-full items-center">
		<BoxHeader>
			<span slot="title" class="flex items-center gap-2 py-2 text-gray-800">
				<span class="text-xl font-medium">NFC 물품 관리</span>
				<span class="material-symbols-outlined text-xl font-medium">info</span>
			</span>
		</BoxHeader>
	</div>
	<Info {data}>
		<div class="flex w-full items-center justify-between gap-6 px-2" slot="other">
			<button
				class="w-full rounded-xl bg-[#275eb0] p-3 text-base font-medium text-white"
				on:click={() => {
					writer = true;
				}}>NFC 기록하기</button
			>
			<button
				class="w-full rounded-xl bg-[#275eb0] p-3 text-base font-medium text-white"
				on:click={() => {
					eraser = true;
				}}>NFC 삭제하기</button
			>
		</div>
	</Info>
	{#if writer}
		<NfcWriter
			{writeData}
			on:close={() => {
				writer = false;
			}}
		/>
	{/if}
	{#if eraser}
		<NfcClear
			on:close={() => {
				eraser = false;
			}}
		/>
	{/if}
</CenterAlign>
