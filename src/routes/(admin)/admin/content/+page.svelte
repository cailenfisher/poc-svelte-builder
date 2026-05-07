<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	type Link = {
		id: number;
		slug: string;
		title: string;
		scope: string | null;
	};

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { links } = $derived(data);

	let creating = $state(false);

	const columns = [
		{ key: 'slug' as keyof Link, label: 'Slug', sortable: true },
		{ key: 'title' as keyof Link, label: 'Title', sortable: true },
		{ key: 'scope' as keyof Link, label: 'Scope', sortable: true },
	];

	function filterLinks(item: Link, query: string): boolean {
		return (
			item.slug.toLowerCase().includes(query) ||
			item.title.toLowerCase().includes(query) ||
			(item.scope ?? '').toLowerCase().includes(query)
		);
	}
</script>

<svelte:head>
	<title>Content — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Content</h1>
		<p class="mt-1 text-sm text-gray-500">Manage translatable content links and their translations.</p>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">Content link created.</Alert>
	{/if}

	<!-- Create form -->
	<Card>
		<h2 class="mb-4 text-base font-semibold text-gray-900">Add content link</h2>
		<form method="POST" action="?/create" use:enhance={() => {
			creating = true;
			return async ({ update }) => { await update(); creating = false; };
		}} class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<div>
				<label for="slug" class="mb-1 block text-xs font-medium text-gray-600">Slug</label>
				<input
					id="slug"
					name="slug"
					type="text"
					placeholder="nav_sign_in"
					required
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="title" class="mb-1 block text-xs font-medium text-gray-600">Title</label>
				<input
					id="title"
					name="title"
					type="text"
					placeholder="Nav: Sign in button"
					required
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="scope" class="mb-1 block text-xs font-medium text-gray-600">Scope (optional)</label>
				<input
					id="scope"
					name="scope"
					type="text"
					placeholder="profile"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div class="sm:col-span-3 flex justify-end">
				<Button type="submit" variant="primary" loading={creating}>Add link</Button>
			</div>
		</form>
	</Card>

	<!-- List -->
	<DataTable items={links as unknown as Record<string, unknown>[]} {columns} filterFn={filterLinks as (item: Record<string, unknown>, q: string) => boolean}>
		{#snippet row(item)}
			{@const link = item as unknown as Link}
			<tr class="hover:bg-gray-50">
				<td class="px-4 py-3 font-mono text-xs text-gray-600">{link.slug}</td>
				<td class="px-4 py-3 text-gray-900">{link.title}</td>
				<td class="px-4 py-3">
					{#if link.scope}
						<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{link.scope}</span>
					{:else}
						<span class="text-gray-400 text-xs">global</span>
					{/if}
				</td>
				<td class="px-4 py-3 text-right">
					<div class="flex justify-end gap-2">
						<a href="/admin/content/{link.id}" class="text-sm text-blue-600 hover:underline">Translations</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={link.id} />
							<button
								type="submit"
								class="text-sm text-red-500 hover:underline"
								onclick={(e) => { if (!confirm(`Delete "${link.slug}"?`)) e.preventDefault(); }}
							>
								Delete
							</button>
						</form>
					</div>
				</td>
			</tr>
		{/snippet}
	</DataTable>
</div>
