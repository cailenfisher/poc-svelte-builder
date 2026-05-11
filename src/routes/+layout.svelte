<script lang="ts">
	import { PUBLIC_APPLICATION_DEFAULT_LANGUAGE, PUBLIC_APPLICATION_LANGUAGE_SUPPORT_ENABLED } from '$env/static/public';
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Dictionary } from '$lib/localization/dictionary.svelte';
	import { setDictionary } from '$lib/localization/context.svelte';
	import Navbar from '$lib/components/universal/Nav/Navbar.svelte';

	let { data, children } = $props();
	let { supabase, session, dictionaryPayload, navItems, notifications } = $derived(data);

	let enableLocalization = Boolean(PUBLIC_APPLICATION_LANGUAGE_SUPPORT_ENABLED);

	const dict = new Dictionary(PUBLIC_APPLICATION_DEFAULT_LANGUAGE);
	setDictionary(dict);

	// Synchronous initial load — runs during SSR so content is available on first render.
	// Intentionally reads the initial value of dictionaryPayload only; $effect handles reloads.
	dict.loadDictionary(dictionaryPayload);

	// Re-load on client-side navigation when the server returns new dictionaryPayload.
	$effect(() => {
		dict.loadDictionary(dictionaryPayload);
	});

	// Reactive: re-evaluates whenever dict.#data changes (via $state inside Dictionary).
	let dictionaryLoaded = $derived(dict.isLoaded);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head><title>{dict.localText('site_name')}</title></svelte:head>

{#if page.url.pathname.startsWith('/demo')}
	{#if dictionaryLoaded || !enableLocalization}
		{@render children()}
	{:else}
		<div class="p-6 text-2xl text-amber-200">Loading localized content...</div>
	{/if}
{:else}
	<div class="min-h-screen bg-gray-50 p-6">
		{#if dictionaryLoaded || !enableLocalization}
			<Navbar {session} {navItems} {notifications} />
			{@render children()}
		{:else}
			<div class="p-1 text-2xl text-amber-200">Loading localized content...</div>
		{/if}
	</div>
{/if}
