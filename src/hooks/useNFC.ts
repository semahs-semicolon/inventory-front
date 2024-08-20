import { getTextRecord, NFC, type NFCData } from '../utils/NFC';
import { goto } from '$app/navigation';
import { get, writable } from 'svelte/store';
import { page } from '$app/stores';
import { routeIncludes } from '../utils/RouteName';

export const NFCRoot = writable<NFC>();
export const NFCResult = writable<{ id: string | null; type: string | null }>({ id: null, type: null });
export const NFCUsePath = writable<Array<string>>([]);

export default function useNFC(preventNavigation: boolean, path?: string): void {
	if (!get(NFCRoot)) {
		const nfc = new NFC();
		nfc.setScanCallback(readingCallback);
		nfc.startScan().then(() => {
			NFCRoot.set(nfc);
		});
	}
	if (path) {
		if (!get(NFCUsePath).includes(path)) {
			NFCUsePath.update((prev) => {
				return [...prev, path];
			});
		}
	}
	let currentPath = '';
	page.subscribe((i) => {
		currentPath = i.url.pathname;
	});
	function readingCallback(data: NFCData) {
		console.log(data);
		if (routeIncludes(get(NFCUsePath), currentPath))
			if (data.data.length < 4) {
				const textRecords = getTextRecord(data.data);
				const idRecord = NFCTextRecordParser('Inv.Id.', textRecords);
				const typeRecord = NFCTextRecordParser('Inv.Type.', textRecords);
				console.log(textRecords, idRecord, typeRecord);
				if (typeRecord && Number(idRecord)) {
					switch (typeRecord) {
						case 'PRODUCT':
							if (!preventNavigation) {
								goto(`/dashboard/products/${idRecord}`);
							}
							NFCResult.set({ id: idRecord, type: typeRecord });
							break;
						case 'LOCATION':
							if (!preventNavigation) {
								goto(`/dashboard/tree/${idRecord}`);
							}
							NFCResult.set({ id: idRecord, type: typeRecord });
					}
				}
			}
	}
}

function NFCTextRecordParser(recordType: string, textRecord: Array<string>) {
	const record = textRecord.find((i) => {
		return i.startsWith(recordType);
	});
	if (record) {
		return record.split(recordType)[1] || null;
	}
	return null;
}
