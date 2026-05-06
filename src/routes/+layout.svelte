<script lang="ts">
	import { PUBLIC_APPLICATION_LANGUAGE_SUPPORT_ENABLED } from '$env/static/public';
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loadDictionary } from '$lib/localization/dictionary.svelte';
	import ProfileSummaryWidget from '$lib/components/universal/User/Account/ProfileSummaryWidget.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';

	let { data, children } = $props();
	let { supabase, session, dictionaryPayload } = $derived(data);

	let enableLocalization = Boolean(PUBLIC_APPLICATION_LANGUAGE_SUPPORT_ENABLED);

	let dictionaryLoaded = $state(false);
	$effect(() => {
		dictionaryLoaded = loadDictionary(dictionaryPayload);
	});

	onMount(() => {
		console.log('session', session);
		const { data } = supabase.auth.onAuthStateChange((_event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head><title>Svelte Builder POC</title></svelte:head>

<div class="h-screen w-screen p-6">
	{#if dictionaryLoaded || !enableLocalization}
		<nav
			class="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-sm"
		>
			<a href="/" class="text-base font-semibold text-gray-900 hover:text-blue-600">
				<LocalText slug="nav_brand" />
			</a>
			<div class="flex items-center gap-4">
				{#if !session}
					<a
						href="/login"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
					>
						<LocalText slug="nav_sign_in" />
					</a>
				{:else}
					<a
						href="/profile"
						class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
					>
						<ProfileSummaryWidget {session} />
					</a>
				{/if}
			</div>
		</nav>

		{@render children()}
	{:else}
		<div class="p-1 text-2xl text-amber-200">Loading localized content...</div>
	{/if}
</div>
