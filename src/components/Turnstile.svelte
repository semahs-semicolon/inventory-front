<script>
	import { Turnstile } from 'svelte-turnstile';
	import { createEventDispatcher } from 'svelte';
	import { PUBLIC_TURNSTILE_KEY } from '$env/static/public';

	const dispatch = createEventDispatcher();
	const callback = (turnstile) => {
		dispatch('token', turnstile.detail.token);
	};
</script>

<Turnstile
	siteKey={PUBLIC_TURNSTILE_KEY}
	on:callback={callback}
	retry="auto"
	retryInterval="500"
	theme="light"
/>
