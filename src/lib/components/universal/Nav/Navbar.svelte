<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import Button from '$lib/components/ui/Button.svelte';
	import ProfileSummaryWidget from '$lib/components/universal/User/Account/ProfileSummaryWidget.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';

	let { session }: { session: Session | null } = $props();
</script>

<nav class="navbar">
	<a href="/" class="navbar-brand">
		<LocalText slug="nav_brand" />
	</a>
	<div class="flex items-center gap-4">
		{#if !session}
			<Button href="/login" variant="primary" size="sm">
				<LocalText slug="nav_sign_in" />
			</Button>
		{:else}
			<a href="/admin" class="back-link">Admin</a>
			<a href="/profile" class="flex items-center gap-2">
				<ProfileSummaryWidget {session} />
			</a>
		{/if}
	</div>
</nav>
