<script>
	import { API_URL } from '../../api.js';
	import { ACCESS_TOKEN } from '../../stores/AccessToken.js';
	import { internalServerError, unauthorized } from '../../utils/ErrorHandler.js';
	import useNFC from '../../hooks/useNFC.ts';
	import { goto } from '$app/navigation';
	import { RouteName } from '../../utils/RouteName.js';
	import CenterAlign from '../../components/layout/CenterAlign.svelte';
	import BoxHeader from '../../components/layout/BoxHeader.svelte';
	let username = '',
		password = '',
		nickname = '',
		code = '';
	let informTableOpen = false;
	const signup = async () => {
		const resp = await fetch(`${API_URL()}/users/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({
				username: username,
				password: password,
				nickname: nickname,
				verifyCode: code
			})
		});
		if (resp.status == 200) {
			const token = await resp.text();
			$ACCESS_TOKEN = token;
			goto('/dashboard');
			useNFC(false, '/dashboard');
		} else {
			internalServerError();
		}
	};
</script>

<div class="flex h-full w-full items-center justify-center font-medium">
	<div class="flex flex-col items-center gap-10">
		<div class="flex w-full flex-col items-center justify-center gap-2">
			<a class="material-symbols-outlined w-full text-4xl font-semibold" href="/signin">arrow_back</a>
			<span class="text-2xl font-semibold text-[#0060B7]">세마고등학교</span>
			<span class="text-4xl font-semibold">과학실 물품 관리 시스템</span>
		</div>
		<div class="flex w-full flex-col items-center gap-4">
			<input type="text" placeholder="아이디" bind:value={username} class="w-full rounded-xl bg-gray-200 p-3 text-lg font-medium focus:outline-0" />
			<input
				type="password"
				placeholder="패스워드"
				bind:value={password}
				class="w-full rounded-xl bg-gray-200 p-3 text-lg font-medium focus:outline-0"
			/>
			<input
				type="text"
				placeholder="닉네임(별칭)"
				bind:value={nickname}
				class="w-full rounded-xl bg-gray-200 p-3 text-lg font-medium focus:outline-0"
			/>
			<input type="text" placeholder="인증 코드" bind:value={code} class="w-full rounded-xl bg-gray-200 p-3 text-lg font-medium focus:outline-0" />
		</div>

		<div class="flex w-full flex-col items-center justify-center gap-4">
			<button
				class="mx-4 flex w-full items-center justify-center rounded-2xl bg-blue-500 py-2 text-xl font-medium text-white hover:bg-blue-600 hover:drop-shadow-lg"
				on:click={signup}>계정 생성</button
			>
			<a class="text-base font-normal text-gray-500 hover:text-gray-600" href="/signin">이미 계정이 있으십니까?</a>
			<button class="text-base font-normal text-gray-500 hover:text-gray-600" on:click={() => (informTableOpen = true)}
				>인증 코드가 없으십니까?</button
			>
		</div>
	</div>
	{#if informTableOpen}
		<div class="absolute left-0 top-0 z-[60] h-full w-full rounded-xl text-black">
			<CenterAlign>
				<div class="flex w-96 flex-col bg-gray-50">
					<BoxHeader>
						<span slot="title">인증 코드가 없으십니까?</span>
						<button
							slot="other"
							class="material-symbols-outlined px-2 text-2xl font-medium"
							on:click={() => {
								informTableOpen = false;
							}}>close</button
						>
					</BoxHeader>
					<div class="flex flex-col gap-2 p-4 text-base font-normal">
						<span
							>세마고등학교 과학실 물품 관리 시스템은 세마고등학교 재학생을 위하여 만들어진 시스템으로 외부인의 관리 계정 생성을 차단하고 있습니다.</span
						>
						<span>인증 코드는 세마고등학교 과학 중점 과정 학생에게 선제적으로 배부되었으며, 그 이외의 재학생은 발급을 신청할 수 있습니다.</span>
						<span>인증 코드 발급은 세마고등학교 물리공학 동아리 SEDA에 문의해주시기 바랍니다.</span>
					</div>
				</div>
			</CenterAlign>
		</div>
		<div class="absolute left-0 top-0 z-50 h-full w-full bg-black opacity-40" />
	{/if}
</div>
