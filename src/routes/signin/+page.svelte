<script>
	import { API_URL } from '../../api';
	import { ACCESS_TOKEN } from '../../stores';
	import Turnstile from '../../components/Turnstile.svelte';
	let turnstileToken;
	const onToken = (token) => {
		turnstileToken = token;
	};
	let username = '',
		password = '';

	const signin = async () => {
		const resp = await fetch(`${API_URL()}/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});
		if (resp.status === 200) {
			$ACCESS_TOKEN = await resp.text();

			location.href = '/dashboard';
		} else {
			alert(await resp.text());
		}
	};
</script>

<div class="flex h-full w-full items-center justify-center font-medium">
	<div class="flex flex-col items-center gap-10">
		<div class="flex w-full flex-col items-center justify-center gap-2">
			<span class="text-2xl font-semibold text-[#0060B7]">세마고등학교</span>
			<span class="text-4xl font-semibold">과학실 물품 관리 시스템</span>
		</div>
		<div class="flex w-full flex-col items-center gap-4">
			<input
				type="text"
				placeholder="아이디"
				bind:value={username}
				class="w-full rounded-xl bg-gray-200 p-4 text-lg font-medium focus:outline-0"
			/>
			<input
				type="password"
				placeholder="패스워드"
				bind:value={password}
				class="w-full rounded-xl bg-gray-200 p-4 text-lg font-medium focus:outline-0"
			/>
		</div>

		<div class="flex w-full flex-col items-center justify-center gap-4">
			<button
				class="mx-4 flex w-full items-center justify-center rounded-2xl bg-blue-500 py-2 text-xl font-medium text-white hover:bg-blue-600 hover:drop-shadow-lg"
				on:click={signin}>로그인</button
			>
			<a class="text-base font-normal text-gray-500 hover:text-gray-600" href="/"
				>게스트 계정으로 로그인</a
			>
			<a class="text-base font-normal text-gray-500 hover:text-gray-600" href="/"
				>계정이 없으십니까?</a
			>
		</div>
		<Turnstile on:token={onToken} />
	</div>
</div>
