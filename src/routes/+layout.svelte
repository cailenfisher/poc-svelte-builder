<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Svelte Builder POC</title>
</svelte:head>

<div class="h-screen w-screen p-6">
	<div class="top-0 w-full p-2">
		{#if !session}
			<a href="/login">Magic Link Login</a> ----
			<a href="/login/google">Google Login</a>
		{:else}
			LOGGED IN
		{/if}
	</div>

	{@render children()}
</div>
