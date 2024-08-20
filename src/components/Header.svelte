<script>
	import { hasAuthority } from '../api.js';
	import { routeMatches } from '../utils/RouteName.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CenterAlign from './layout/CenterAlign.svelte';
	import BoxHeader from './layout/BoxHeader.svelte';
	import { RouteName } from '../utils/RouteName.js';
	import { ACCESS_TOKEN } from '../stores/AccessToken.js';

	let managementLogin = false;
	let routeName;
	let routingTableOpen = false;

	if (hasAuthority(['ROLE_STUDENT'])) {
		managementLogin = true;
	}

	$: routeName = routeMatches($page.url.pathname);
</script>

<div class="flex items-center justify-between bg-[#275eb0] px-6 py-3.5 text-white">
	<div class="flex items-center gap-4">
		<button
			class="text-xl font-semibold"
			on:click={() => {
				goto('/dashboard');
			}}>과학실 물품관리 시스템</button
		>
		<button
			class="flex items-center gap-2"
			on:click={() => {
				routingTableOpen = !routingTableOpen;
			}}
		>
			<span class="text-lg text-gray-300">{routeName}</span>
			<span class="material-symbols-outlined text-xl font-medium text-gray-200">expand_circle_down</span>
		</button>
	</div>
	<div class="flex items-center text-lg font-medium">
		{#if managementLogin}
			<button
				on:click={() => {
					ACCESS_TOKEN.set(null);
					goto('/');
				}}>로그아웃</button
			>
		{:else}
			<button
				on:click={() => {
					ACCESS_TOKEN.set(null);
					goto('/signin');
				}}>관리 계정 로그인</button
			>
		{/if}
	</div>
	{#if routingTableOpen}
		<div class="absolute left-0 top-0 z-[60] h-full w-full rounded-xl text-black">
			<CenterAlign>
				<div class="flex w-96 flex-col bg-gray-50">
					<BoxHeader>
						<span slot="title">메뉴</span>
						<button
							slot="other"
							class="material-symbols-outlined px-2 text-2xl font-medium"
							on:click={() => {
								routingTableOpen = false;
							}}>close</button
						>
					</BoxHeader>
					<div class="flex flex-col">
						{#each Object.entries(RouteName) as [key, value]}
							<button
								class="flex items-center px-4 py-3 hover:bg-neutral-200"
								on:click={() => {
									goto(`${key.replace('/*', '')}`);
									routingTableOpen = false;
								}}
							>
								<span class="material-symbols-outlined text-xs font-medium">radio_button_unchecked</span>
								<div class="flex w-full items-center justify-between px-2">
									<span class="text-base">{value}</span>
									<span class="text-xs text-gray-600">{key}</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</CenterAlign>
		</div>
		<div class="absolute left-0 top-0 z-50 h-full w-full bg-black opacity-40" />
	{/if}
</div>
