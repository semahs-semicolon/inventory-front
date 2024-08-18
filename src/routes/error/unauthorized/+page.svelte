<script>
	import CenterAlign from '../../../components/layout/CenterAlign.svelte';
	import { goto } from '$app/navigation';
	import PrimaryButton from '../../../components/button/PrimaryButton.svelte';
</script>

<CenterAlign>
	<div class="flex flex-col items-center gap-6">
		<span class="material-symbols-outlined text-8xl font-medium text-red-500">error</span>
		<span class="text-2xl font-semibold text-gray-800">401 Unauthorized</span>
		<div class="flex flex-col items-center gap-2 text-lg font-medium">
			<span>이 페이지에 접근할 권한이 없습니다.</span>
			<span>다시 로그인해야 합니다.</span>
		</div>
		<span class="text-base font-normal text-gray-700">
			<button
				on:click={() => {
					goto('/');
				}}
				class="font-semibold text-blue-600 underline">로그인</button
			>
			페이지로 돌아가기
		</span>
	</div>
</CenterAlign>
