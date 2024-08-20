<script>
	import CenterAlign from '../layout/CenterAlign.svelte';
	import BoxHeader from '../layout/BoxHeader.svelte';
	import { createEventDispatcher } from 'svelte';
	import { NFCRoot } from '../../hooks/useNFC.ts';

	export let data;
	$: {
		const nfcMessageInit = {
			records: data
		};
		if ($NFCRoot) {
			$NFCRoot.writeOverride(nfcMessageInit);
		}
	}
	let dispatcher = createEventDispatcher();
</script>

<div class="absolute left-0 top-0 z-[60] h-full w-full rounded-xl text-black">
	<CenterAlign>
		<div class="flex w-96 flex-col bg-gray-50">
			<BoxHeader>
				<span slot="title">NFC 쓰기</span>
				<button
					slot="other"
					class="material-symbols-outlined px-2 text-2xl font-medium"
					on:click={() => {
						dispatcher('close');
					}}>close</button
				>
			</BoxHeader>
			<div class="flex w-80 flex-col items-center justify-center bg-neutral-200">
				<span class="material-symbols-outlined text-7xl text-neutral-800">nfc</span>
				<span class="text-lg font-medium">NFC 태그를 스캔하세요</span>
			</div>
		</div>
	</CenterAlign>
</div>
<div class="absolute left-0 top-0 z-50 h-full w-full bg-black opacity-40" />
