<script>
	import { API_URL, authfetch } from '../../../api.js';
	import PrimaryButton from '../../../components/button/PrimaryButton.svelte';
	export let data;

	let codeIdentifierMap = {};

	$: {
		data.codes.forEach((code) => {
			const matchIdentifier = data.identifier.find((i) => i.identifierCode === code.identifier);
			if (matchIdentifier) codeIdentifierMap[code.code] = matchIdentifier;
		});
	}
	async function reload() {
		const [codes, identifier] = await Promise.all([
			authfetch(`${API_URL()}/verifyCode/verifyCode`).then((data) => data.json()),
			authfetch(`${API_URL()}/verifyCode/identifier`).then((data) => data.json())
		]);
		data = {
			codes,
			identifier
		};
	}
	function invokeCode(code) {
		authfetch(`${API_URL()}/verifyCode/verifyCode/${code}`, {
			method: 'DELETE'
		}).then(() => {
			reload();
		});
	}
	function removeHandlerFactory(code) {
		return () => {
			invokeCode(code);
		};
	}
	function createCode() {
		const identifier = prompt('identifier');
		const authority = prompt('authority (null for default)') || ['ROLE_STUDENT'];
		authfetch(`${API_URL()}/verifyCode/verifyCode`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ identifier, authority })
		}).then(() => {
			reload();
		});
	}
	async function createManyCode() {
		const identifier = prompt('identifier, (split by ",")').split(',');
		const authority = prompt('authority (null for default)') || ['ROLE_STUDENT'];
		if (identifier.length > 1) {
			for (const i of identifier) {
				await authfetch(`${API_URL()}/verifyCode/verifyCode`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					body: JSON.stringify({ identifier: i, authority })
				});
			}
		}
	}
</script>

<PrimaryButton on:click={createCode}>생성</PrimaryButton>
<PrimaryButton on:click={createManyCode}>대량생성</PrimaryButton>
<table>
	<thead>인증 코드</thead>
	<tbody>
		<tr>
			<td>code</td>
			<td>identifier</td>
			<td>authority</td>
			<td>metadata</td>
			<td>invoke</td>
		</tr>
		{#each data.codes as code}
			<tr>
				<td>{code.code}</td>
				<td>{code.identifier}</td>
				<td>{code.authority}</td>

				<td>
					{#if codeIdentifierMap[code.code]}
						{Object.entries(JSON.parse(codeIdentifierMap[code.code].metadata))
							.map((i) => i[1])
							.join('.')}
					{/if}
				</td>
				<td><button on:click={removeHandlerFactory(code.code)} class="material-symbols-outlined text-2xl font-medium">delete</button></td>
			</tr>
		{/each}
	</tbody>
</table>
