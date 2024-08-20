<script>
	import CenterAlign from '../../../../../components/layout/CenterAlign.svelte';
	import BoxHeader from '../../../../../components/layout/BoxHeader.svelte';
	import { getProductRecord } from '../../../../../utils/NFC.ts';
	import NfcClear from '../../../../../components/nfc/NfcClear.svelte';
	import NfcWriter from '../../../../../components/nfc/NfcWriter.svelte';
	import { goto } from '$app/navigation';

	export let data;
	let writeData;
	$: {
		if (data) {
			writeData = getProductRecord(data.itself.id);
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
	<div class="flex flex-col items-center justify-center gap-4">
		<div class="flex aspect-square flex-col items-center justify-center rounded-lg bg-neutral-200 p-8">
			<span class="material-symbols-outlined text-[12rem] font-bold text-neutral-800"> nfc </span>
		</div>
		<div class="flex flex-col items-center justify-center">
			<span class="text-lg font-medium text-neutral-800">이 NFC에는 보관 장소가 등록되어 있습니다.</span>
			<div>
				<span class="text-lg font-medium text-neutral-500">등록된 보관 장소</span>
				<a class="text-lg font-medium text-blue-500 underline-offset-1" href={`/dashboard/tree/${data.itself.id}`}>{data.itself.name}</a>
			</div>
		</div>
		<div class="flex w-full items-center justify-between gap-6 px-2">
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
	</div>
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
