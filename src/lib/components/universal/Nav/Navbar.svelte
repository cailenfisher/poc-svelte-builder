<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import type { NavItem } from '$lib/types/nav';
	import Button from '$lib/components/ui/Button.svelte';
	import ProfileSummaryWidget from '$lib/components/universal/User/Account/ProfileSummaryWidget.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { page } from '$app/state';

	let { session, navItems = [] }: { session: Session | null; navItems: NavItem[] } = $props();

	const visibleItems = $derived(
		navItems.filter((item) => !item.requires_auth || session !== null)
	);
</script>

<nav class="navbar">
	<a href="/" class="navbar-brand">
		<LocalText slug="nav_brand" />
	</a>
	<div class="flex items-center gap-4">
		{#each visibleItems as item}
			<a
				href={item.href}
				class="nav-item"
				class:nav-item-active={page.url.pathname === item.href ||
					(item.href !== '/' && page.url.pathname.startsWith(item.href + '/'))}
			>
				{item.label}
			</a>
		{/each}
		{#if !session}
			<Button href="/login" variant="primary" size="sm">
				<LocalText slug="nav_sign_in" />
			</Button>
		{:else}
			<a href="/profile" class="flex items-center gap-2">
				<ProfileSummaryWidget {session} />
			</a>
		{/if}
	</div>
</nav>
