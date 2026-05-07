<script lang="ts">
	import type { PageData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';

	let { data }: { data: PageData } = $props();
	let { stats } = $derived(data);
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="page-title">Dashboard</h1>
		<p class="mt-1 page-subtitle">Overview of your localization content.</p>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<Card>
			<p class="stat-label">Locales</p>
			<p class="mt-1 stat-number">{stats.localeCount}</p>
			<a href="/admin/locale" class="mt-3 block link-action">Manage locales →</a>
		</Card>

		<Card>
			<p class="stat-label">Content links</p>
			<p class="mt-1 stat-number">{stats.linkCount}</p>
			<a href="/admin/content" class="mt-3 block link-action">Manage content →</a>
		</Card>

		<Card>
			<p class="stat-label">Translations</p>
			<p class="mt-1 stat-number">{stats.translationCount}</p>
		</Card>
	</div>
</div>
