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
		<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
		<p class="mt-1 text-sm text-gray-500">Overview of your localization content.</p>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<Card>
			<p class="text-sm font-medium text-gray-500">Locales</p>
			<p class="mt-1 text-3xl font-bold text-gray-900">{stats.localeCount}</p>
			<a href="/admin/locale" class="mt-3 block text-sm text-blue-600 hover:underline">
				Manage locales →
			</a>
		</Card>

		<Card>
			<p class="text-sm font-medium text-gray-500">Content links</p>
			<p class="mt-1 text-3xl font-bold text-gray-900">{stats.linkCount}</p>
			<a href="/admin/content" class="mt-3 block text-sm text-blue-600 hover:underline">
				Manage content →
			</a>
		</Card>

		<Card>
			<p class="text-sm font-medium text-gray-500">Translations</p>
			<p class="mt-1 text-3xl font-bold text-gray-900">{stats.translationCount}</p>
		</Card>
	</div>
</div>
