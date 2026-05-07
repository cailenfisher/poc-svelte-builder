<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavLink from '$lib/components/ui/NavLink.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import {
		faGauge,
		faLanguage,
		faFileLines,
		faBars,
		faArrowRightFromBracket,
	} from '@fortawesome/free-solid-svg-icons';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="admin-shell">
	<aside class="admin-sidebar">
		<div class="admin-sidebar-header">
			<a href="/" class="navbar-brand">SvelteBuilder</a>
			<span class="admin-badge">Admin</span>
		</div>

		<nav class="admin-sidebar-nav">
			<NavLink href="/admin" label="Dashboard" icon={faGauge} />
			<NavLink href="/admin/locale" label="Locales" icon={faLanguage} />
			<NavLink href="/admin/content" label="Content" icon={faFileLines} />
			<NavLink href="/admin/navigation" label="Navigation" icon={faBars} />
		</nav>

		<div class="admin-sidebar-footer">
			<form method="POST" action="/profile?/signOut">
				<Button type="submit" variant="secondary" class="w-full justify-start">
					<Icon icon={faArrowRightFromBracket} fixedWidth />
					Sign out
				</Button>
			</form>
		</div>
	</aside>

	<main class="admin-main">
		{@render children?.()}
	</main>
</div>
