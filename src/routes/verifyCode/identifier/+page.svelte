<script>
	import { API_URL, authfetch } from '../../../api.js';
	import PrimaryButton from '../../../components/button/PrimaryButton.svelte';

	export let data;
	async function reload() {
		const [identifier] = await Promise.all([authfetch(`${API_URL()}/verifyCode/identifier`).then((data) => data.json())]);
		data = {
			identifier
		};
	}
	function invokeIdentifier(code) {
		authfetch(`${API_URL()}/verifyCode/identifier/${code}`, {
			method: 'DELETE'
		}).then(() => {
			reload();
		});
	}
	function removeHandlerFactory(code) {
		return () => {
			invokeIdentifier(code);
		};
	}
	async function createCode() {
		const classNum = prompt('classNum');
		const number = prompt('number');
		const name = prompt('name');
		const res = await authfetch(`${API_URL()}/verifyCode/identifier`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({ metadata: JSON.stringify({ classNum, number, name }) })
		});
		await reload();
	}
	function createManyIdentifier() {
		const classNum = prompt('classnum');
		const maxNumber = prompt('maxNumber');
		const names = prompt('nam split by ","').split(',');
		const promiseList = [];
		//loop for maxNumber times
		for (let i = 0; i < maxNumber; i++) {
			promiseList.push(
				authfetch(`${API_URL()}/verifyCode/identifier`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					body: JSON.stringify({ metadata: JSON.stringify({ classNum, number: i + 1, name: names[i] }) })
				})
			);
		}
		Promise.all(promiseList).then(() => {
			reload();
		});
	}
</script>

<PrimaryButton on:click={createCode}>생성</PrimaryButton>
<PrimaryButton on:click={createManyIdentifier}>대량 생성</PrimaryButton>
<table>
	<thead>식별자</thead>
	<tbody>
		<tr>
			<td>identifier</td>
			<td>metadata</td>
			<td>invoke</td>
		</tr>
		{#each data.identifier as identifier}
			<tr>
				<td>{identifier.identifierCode}</td>
				<td>{identifier.metadata}</td>
				<td
					><button on:click={removeHandlerFactory(identifier.identifierCode)} class="material-symbols-outlined text-lg font-medium">delete</button
					></td
				>
			</tr>
		{/each}
	</tbody>
</table>
