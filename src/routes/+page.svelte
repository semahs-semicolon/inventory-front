<script>
	import { API_URL } from '../api';
	import Turnstile from '../components/Turnstile.svelte';
	import { ACCESS_TOKEN } from '../stores.js';

	let turnstileToken;
	const onToken = (token) => {
		turnstileToken = token;
	};
	const guestLogin = async () => {
		if (turnstileToken !== null) {
			const res = await fetch(`${API_URL()}/guestLogin`, {
				method: 'POST',
				body: {
					token: turnstileToken
				}
			});
			if (res.status === 200) {
				$ACCESS_TOKEN = await res.text();
				location.href = '/dashboard';
			} else {
				alert(await res.text());
			}
		}
	};
</script>

<div class="flex h-full w-full items-center justify-center font-medium">
	<div class="flex flex-col items-center gap-10">
		<span class="material-symbols-outlined text-9xl">category_search</span>
		<div class="flex w-full flex-col items-center justify-center gap-2">
			<span class="text-2xl font-semibold text-[#0060B7]">세마고등학교</span>
			<span class="text-4xl font-semibold">과학실 물품 관리 시스템</span>
		</div>

		<div class="flex w-full flex-col items-center justify-center gap-4">
			<button
				class="mx-4 flex w-full items-center justify-center rounded-2xl bg-blue-500 py-2 text-xl font-medium text-white hover:bg-blue-600 hover:drop-shadow-lg"
				on:click={guestLogin}>접속</button
			>
			<a class="text-base font-normal text-gray-500 hover:text-gray-600" href="/signin"
				>관리 계정으로 로그인</a
			>
		</div>
		<Turnstile on:token={onToken} />
	</div>
</div>
