<script>
	import { onNavigate } from '$app/navigation';

	import Header from '../../components/Header.svelte';
	import useNFC from '../../hooks/useNFC.ts';
	import { NFC } from '../../utils/NFC.ts';
	$: {
		if (NFC.checkCompatibility()) {
			useNFC(false, '/dashboard/*');
		}
	}
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

<Header />
<div class="container bg-gray-100">
	<slot />
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		padding: 0.5em;
		padding-left: 1em;
		gap: 1em;
		flex-wrap: wrap;
	}
	.header-title {
		font-size: larger;
		font-weight: bolder;
	}
	a {
		text-decoration: none;
		color: white;
	}
	.container {
		display: flex;
		width: 100%;
		max-width: 100%;
		flex: 1 0 auto;
		height: 0;
	}
	.header {
		background-color: #275eb0;
		color: white;
		box-shadow: 0px 0px 10px #275eb0;
		z-index: 50;
	}
</style>
