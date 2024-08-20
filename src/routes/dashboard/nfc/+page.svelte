<script>
	import CenterAlign from '../../../components/layout/CenterAlign.svelte';
	import BoxHeader from '../../../components/layout/BoxHeader.svelte';
	import useNFC, { NFCResult } from '../../../hooks/useNFC.ts';
	import { goto } from '$app/navigation';
	useNFC(true, '/nfc/*');
	$: {
		if ($NFCResult.id) {
			switch ($NFCResult.type) {
				case 'PRODUCT':
					goto(`/dashboard/nfc/${$NFCResult.id}`);
					break;
				case 'LOCATION':
					goto(`/dashboard/tree/${$NFCResult.id}`);
					break;
			}
		}
	}
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
		<button class="flex aspect-square flex-col items-center justify-center rounded-lg bg-neutral-200 p-8">
			<span class="material-symbols-outlined text-[12rem] font-bold text-neutral-800"> nfc </span>
			<span class="text-xl font-medium text-neutral-800">NFC 태그를 스캔하세요</span>
		</button>
		<a href="https://www.samsungsvc.co.kr/solution/1565668" class="text-base font-normal text-gray-600 underline underline-offset-1">
			NFC 스캔이 안 되시나요?
		</a>
	</div>
</CenterAlign>
