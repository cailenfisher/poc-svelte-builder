<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import Button from '$lib/components/ui/Button.svelte';
	import ProfileSummaryWidget from '$lib/components/universal/User/Account/ProfileSummaryWidget.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';

	let { session }: { session: Session | null } = $props();
</script>

<nav class="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-sm">
	<a href="/" class="text-base font-semibold text-gray-900 hover:text-blue-600">
		<LocalText slug="nav_brand" />
	</a>
	<div class="flex items-center gap-4">
		{#if !session}
			<Button href="/login" variant="primary" size="sm">
				<LocalText slug="nav_sign_in" />
			</Button>
		{:else}
			<a href="/admin" class="text-sm text-gray-500 hover:text-gray-900">Admin</a>
			<a href="/profile" class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
				<ProfileSummaryWidget {session} />
			</a>
		{/if}
	</div>
</nav>
