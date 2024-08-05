<script>
	import { onNavigate } from '$app/navigation';
    import { ProgressBar } from "@prgm/sveltekit-progress-bar";

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="flex items-center gap-5 bg-[#275eb0] px-5 py-4 font-normal text-white">
	<a class="text-xl font-medium" href="/dashboard">과학실 물품관리 시스템</a>
	<a class="text-lg" href="/dashboard/products">물품 검색</a>
	<a class="text-lg" href="/dashboard/orphans">연관X 목록</a>
	<a class="text-lg" href="/dashboard/category">카테고리 검색</a>
</div>
<ProgressBar color="#FFFF00" zIndex={100} />
<div class="flex h-0 w-full flex-shrink-0 flex-grow p-3">
	<slot />
</div>
