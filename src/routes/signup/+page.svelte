<script>
	import { API_URL } from '../../api';
	import { ACCESS_TOKEN } from '../../stores';

	let username = '',
		password = '',
		nickname = '';

	const signup = async () => {
		const resp = await fetch(`${API_URL()}/users/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({
				username: username,
				password: password,
				nickname: nickname
			})
		});
		if (resp.status == 200) {
			const token = await resp.text();
			$ACCESS_TOKEN = token;

			location.href = '/dashboard';
		} else {
			alert(await resp.text());
		}
	};
</script>

<div class="flex h-full w-full items-center justify-center font-medium">
	<div class="flex flex-col items-center gap-10">
		<div class="flex w-full flex-col items-center justify-center gap-2">
			<a class="material-symbols-outlined w-full text-4xl font-semibold" href="/signin"
				>arrow_back</a
			>
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
			<input
				type="text"
				placeholder="닉네임(별칭)"
				bind:value={nickname}
				class="w-full rounded-xl bg-gray-200 p-4 text-lg font-medium focus:outline-0"
			/>
		</div>

		<div class="flex w-full flex-col items-center justify-center gap-4">
			<button
				class="mx-4 flex w-full items-center justify-center rounded-2xl bg-blue-500 py-2 text-xl font-medium text-white hover:bg-blue-600 hover:drop-shadow-lg"
				on:click={signup}>계정 생성</button
			>
			<a class="text-base font-normal text-gray-500 hover:text-gray-600" href="/"
				>게스트 계정으로 로그인</a
			>
		</div>
	</div>
</div>
