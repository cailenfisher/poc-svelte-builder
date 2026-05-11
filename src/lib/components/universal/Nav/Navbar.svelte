<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import type { NavItem } from '$lib/types/nav';
	import type { Notification } from '$lib/types/notification';
	import Button from '$lib/components/ui/Button.svelte';
	import ProfileSummaryWidget from '$lib/components/universal/User/Account/ProfileSummaryWidget.svelte';
	import NotificationBell from '$lib/components/universal/Nav/NotificationBell.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	import { page } from '$app/state';
	const dict = getDictionary();

	let {
		session,
		navItems = [],
		notifications = []
	}: { session: Session | null; navItems: NavItem[]; notifications: Notification[] } = $props();

	const visibleItems = $derived(navItems.filter((item) => !item.requires_auth || session !== null));
</script>

<nav class="navbar">
	<a href="/" class="navbar-brand">
		<img class="inline h-32" src="/logo.png" alt={dict.localText('site_name')} />
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
			<NotificationBell {notifications} />
			<a href="/profile" class="flex items-center gap-2">
				<ProfileSummaryWidget {session} />
			</a>
		{/if}
	</div>
</nav>
