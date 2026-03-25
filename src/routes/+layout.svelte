<script lang="ts">
	import { PUBLIC_APPLICATION_LANGUAGE_SUPPORT_ENABLED } from '$env/static/public';
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loadDictionary } from '$lib/localization/dictionary.svelte';

	let { data, children } = $props();
	let { supabase, session, dictionaryPayload } = $derived(data);

	let enableLocalization = Boolean(PUBLIC_APPLICATION_LANGUAGE_SUPPORT_ENABLED);

	let dictionaryLoaded = $state(false);
	$effect(() => {
		dictionaryLoaded = loadDictionary(dictionaryPayload);
	});
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head><title>Svelte Builder POC</title></svelte:head>

<div class="h-screen w-screen p-6">
	<div class="top-0 w-full rounded-lg bg-blue-500 p-2 text-red-500">
		{#if !session}
			<a href="/login">Magic Link Login</a>
			----
			<a href="/login/google">Google Login</a>
		{:else}
			LOGGED IN
		{/if}
	</div>

	{#if dictionaryLoaded || !enableLocalization}
		{@render children()}
	{:else}
		<div class="p-1 text-2xl text-amber-200">Loading localized content...</div>
	{/if}
</div>
