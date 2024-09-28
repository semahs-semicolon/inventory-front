export interface NFCData {
	data: Array<NDEFRecord>;
	tagSerial: string;
}

export class NFC {
	ndef;
	scanCallback: ((data: NFCData) => void) | undefined;
	scanFailedCallback: (() => void) | undefined;
	constructor() {
		if (NFC.checkCompatibility()) {
			this.ndef = new NDEFReader();
		} else {
			throw new Error('nfc not supported');
		}
	}
	async startScan() {
		if (this.ndef) {
			console.log(this.scanFailedCallback, this.scanCallback);
			try {
				await this.ndef.scan();
			} catch (e) {
				console.log(e);
			}
		}
	}
	async write(data: NDEFMessageInit) {
		if (this.ndef) {
			try {
				await this.ndef!.write(data);
			} catch (e) {
				console.log(e);
			}
		}
	}
	async writeOverride(data: NDEFMessageInit) {
		if (this.ndef) {
			try {
				await this.ndef!.write(data, { overwrite: true });
			} catch (e) {
				console.log(e);
			}
		}
	}
	setScanCallback(callback: (data: NFCData) => void) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-expect-error
		this.ndef?.addEventListener('reading', this.readingCallbackFactory(callback));
	}
	setScanErrorCallback(callback: (event: Event) => void) {
		this.ndef?.addEventListener('readingerror', this.readingFailedCallbackFactory(callback));
	}
	static checkCompatibility(): boolean {
		return typeof NDEFReader !== 'undefined';
	}
	private readingCallbackFactory(callback: (data: NFCData) => void): (event: NDEFReadingEvent) => void {
		return (event: NDEFReadingEvent) => {
			const data = event.message.records;
			const serial = event.serialNumber;
			if (serial) {
				callback({ data: Array.from(data), tagSerial: serial });
			}
		};
	}
	private readingFailedCallbackFactory(callback: (event: Event) => void): (event: Event) => void {
		return (event: Event) => {
			callback(event);
		};
	}
}

export function NFCParseToString(data: NDEFRecord): string {
	const dataView = data.data;
	if (dataView) {
		const utf8Bytes = new Uint8Array(dataView.buffer, 0, dataView.byteLength);
		const textDecoder = new TextDecoder();
		return textDecoder.decode(utf8Bytes);
	} else {
		return '';
	}
}

export function NFCUrlRecord(url: string): NDEFRecordInit {
	return { recordType: 'url', data: url } as NDEFRecordInit;
}

export function NFCTextRecord(text: string): NDEFRecordInit {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(text);
	const dataView = new DataView(uint8Array.buffer);
	return { recordType: 'text', data: dataView, encoding: 'utf-8' } as NDEFRecordInit;
}

export function getURLRecord(data: Array<NDEFRecord>): Array<string> {
	const returnValue: string[] = [];
	data.forEach((i) => {
		if (i.recordType === 'url') {
			returnValue.push(NFCParseToString(i));
		}
	});
	return returnValue;
}

export function getTextRecord(data: Array<NDEFRecord>): Array<string> {
	const returnValue: string[] = [];
	data.forEach((i) => {
		if (i.recordType === 'text') {
			returnValue.push(NFCParseToString(i));
		}
	});
	return returnValue;
}

export function getProductRecord(id: string): Array<NDEFRecordInit> {
	return [NFCTextRecord(`Inv.Type.PRODUCT`), NFCTextRecord(`Inv.Id.${id}`), NFCUrlRecord(`https://inventory.seda.club/dashboard/nfc/${id}/product`)];
}
export function getLocationRecord(id: string): Array<NDEFRecordInit> {
	return [
		NFCTextRecord(`Inv.Type.LOCATION`),
		NFCTextRecord(`Inv.Id.${id}`),
		NFCUrlRecord(`https://inventory.seda.club/dashboard/nfc/${id}/location`)
	];
}
