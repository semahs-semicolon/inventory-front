<script>
	import { API_URL } from '../api.js';
	import Turnstile from '../components/Turnstile.svelte';
	import { ACCESS_TOKEN } from '../stores/AccessToken.js';
	import { goto } from '$app/navigation';
	import { badRequest, internalServerError } from '../utils/ErrorHandler.js';
	import { addAlert } from '../stores/AlertPopup.js';

	let turnstileToken;

	const onToken = (token) => {
		turnstileToken = token.detail;
	};

	const guestLogin = async () => {
		if (turnstileToken) {
			const res = await fetch(`${API_URL()}/guestLogin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					token: turnstileToken
				})
			});
			if (res.status === 200) {
				$ACCESS_TOKEN = await res.text();
				goto('/dashboard');
			} else if (res.status === 400) {
				badRequest({
					message: '캡차 검증에 실패하였습니다',
					description: '페이지를 새로고침하고, 다시 시도해주십시오'
				});
			} else {
				internalServerError();
			}
		} else {
			addAlert('접속에 실패했습니다', '캡차를 작성하고 다시 시도해주십시오', 'error', false);
		}
	};
</script>

<div class="flex h-full w-full items-center justify-center font-medium">
	<div class="flex flex-col items-center gap-10">
		<span class="material-symbols-outlined text-9xl">category_search</span>
		<div class="flex flex-col items-center justify-center gap-2">
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
