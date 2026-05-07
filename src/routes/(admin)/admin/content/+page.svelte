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
		<h1 class="page-title">Content</h1>
		<p class="mt-1 page-subtitle">Manage translatable content links and their translations.</p>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">Content link created.</Alert>
	{/if}

	<Card>
		<h2 class="mb-4 card-title">Add content link</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => { await update(); creating = false; };
			}}
			class="grid grid-cols-1 gap-3 sm:grid-cols-3"
		>
			<div>
				<label for="slug" class="mb-1 field-label-xs">Slug</label>
				<input id="slug" name="slug" type="text" placeholder="nav_sign_in" required class="field-control" />
			</div>
			<div>
				<label for="title" class="mb-1 field-label-xs">Title</label>
				<input id="title" name="title" type="text" placeholder="Nav: Sign in button" required class="field-control" />
			</div>
			<div>
				<label for="scope" class="mb-1 field-label-xs">Scope <span class="font-normal text-gray-400">(optional)</span></label>
				<input id="scope" name="scope" type="text" placeholder="profile" class="field-control" />
			</div>
			<div class="flex justify-end sm:col-span-3">
				<Button type="submit" variant="primary" loading={creating}>Add link</Button>
			</div>
		</form>
	</Card>

	<DataTable
		items={links as unknown as Record<string, unknown>[]}
		{columns}
		filterFn={filterLinks as (item: Record<string, unknown>, q: string) => boolean}
	>
		{#snippet row(item)}
			{@const link = item as unknown as Link}
			<tr class="data-table-row">
				<td class="data-table-td font-mono text-xs text-gray-600">{link.slug}</td>
				<td class="data-table-td text-gray-900">{link.title}</td>
				<td class="data-table-td">
					{#if link.scope}
						<span class="badge badge-gray">{link.scope}</span>
					{:else}
						<span class="text-xs text-gray-400">global</span>
					{/if}
				</td>
				<td class="data-table-td text-right">
					<div class="flex justify-end gap-2">
						<a href="/admin/content/{link.id}" class="link-action">Translations</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={link.id} />
							<button
								type="submit"
								class="link-action-danger"
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
