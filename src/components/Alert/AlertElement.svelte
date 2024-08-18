<script>
	import { AlertDisappearTime, removeAlert } from '../../stores/AlertPopup.js';
	export let alertID;
	export let alert = { message: '', description: '', level: '', removable: true };

	if (!alert.removable) {
		setTimeout(() => {
			removeAlert(alertID);
		}, AlertDisappearTime);
	}

	const closeAlert = () => {
		removeAlert(alertID);
	};

	const colorPalette = {
		info: 'slate-400',
		warning: 'yellow-400',
		error: 'red-500'
	};
</script>

{#if alert.message.length > 0}
	<div
		class={`alertIntroAnim relative flex gap-4 rounded-xl bg-${
			colorPalette[alert.level]
		} px-6 py-4 shadow-xl`}
	>
		<span
			class={`material-symbols-outlined absolute -left-3 -top-3 flex h-[2rem] w-[2rem] animate-bounce items-center justify-center rounded-2xl bg-${
				colorPalette[alert.level]
			} text-lg text-white drop-shadow-xl`}>priority_high</span
		>
		{#if alert.removable}
			<button
				class="material-symbols-outlined absolute -right-2 -top-2 flex h-[2rem] w-[2rem] items-center justify-center rounded-2xl bg-gray-200 text-lg font-semibold text-gray-700 shadow-xl"
				on:click={closeAlert}>close</button
			>
		{/if}
		<div class="flex flex-col text-white">
			<span class="text-lg font-medium">{alert.message}</span>
			{#if alert.description}
				<span class="text-base font-normal text-gray-100">{alert.description}</span>
			{/if}
		</div>
	</div>
{/if}

<style>
	.alertIntroAnim {
		animation-name: Intro;
		animation-duration: 0.5s;
		animation-direction: normal;
		animation-fill-mode: both;
	}
	.alertOutroAnim {
		animation-name: Outro;
		animation-duration: 0.3s;
		animation-direction: normal;
		animation-fill-mode: both;
	}
	@keyframes Intro {
		0% {
			opacity: 0;
			transform: translateY(-1rem);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes Outro {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
