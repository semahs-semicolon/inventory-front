<script>
	import { Turnstile } from 'svelte-turnstile';
	import { createEventDispatcher } from 'svelte';
	import { PUBLIC_TURNSTILE_KEY } from '$env/static/public';

	const dispatch = createEventDispatcher();
	const callback = (turnstile) => {
		dispatch('token', turnstile.token);
	};
</script>

<Turnstile siteKey={PUBLIC_TURNSTILE_KEY} on:callback={callback} theme="light" />
