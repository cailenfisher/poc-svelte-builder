<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import type { NavItem } from '$lib/types/nav';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { navItems } = $derived(data);

	let creating = $state(false);

	const columns = [
		{ key: 'sort_order' as keyof NavItem, label: 'Order', sortable: true },
		{ key: 'label' as keyof NavItem, label: 'Label', sortable: true },
		{ key: 'href' as keyof NavItem, label: 'Href', sortable: true },
		{ key: 'requires_auth' as keyof NavItem, label: 'Auth required' },
		{ key: 'is_published' as keyof NavItem, label: 'Published' },
	];

	function filterItems(item: NavItem, query: string): boolean {
		return (
			item.label.toLowerCase().includes(query) || item.href.toLowerCase().includes(query)
		);
	}
</script>

<svelte:head>
	<title>Navigation — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="page-title">Navigation</h1>
		<p class="mt-1 page-subtitle">Manage navbar items shown to visitors.</p>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">Nav item created successfully.</Alert>
	{/if}

	<Card>
		<h2 class="mb-4 card-title">Add item</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => { await update(); creating = false; };
			}}
			class="grid grid-cols-1 gap-3 sm:grid-cols-4"
		>
			<div>
				<label for="label" class="mb-1 field-label-xs">Label</label>
				<input id="label" name="label" type="text" placeholder="Home" required class="field-control" />
			</div>
			<div>
				<label for="href" class="mb-1 field-label-xs">Href</label>
				<input id="href" name="href" type="text" placeholder="/" required class="field-control" />
			</div>
			<div>
				<label for="sort_order" class="mb-1 field-label-xs">Sort order</label>
				<input id="sort_order" name="sort_order" type="number" value="0" class="field-control" />
			</div>
			<div class="flex flex-col justify-end gap-1">
				<label class="flex items-center gap-2 text-sm text-gray-700">
					<input type="checkbox" name="requires_auth" value="true" class="rounded" />
					Requires auth
				</label>
			</div>
			<div class="flex justify-end sm:col-span-4">
				<Button type="submit" variant="primary" loading={creating}>Add item</Button>
			</div>
		</form>
	</Card>

	<DataTable
		items={navItems as unknown as Record<string, unknown>[]}
		{columns}
		filterFn={filterItems as (item: Record<string, unknown>, q: string) => boolean}
	>
		{#snippet row(item)}
			{@const nav = item as unknown as NavItem}
			<tr class="data-table-row">
				<td class="data-table-td text-center text-gray-500">{nav.sort_order}</td>
				<td class="data-table-td font-medium text-gray-900">{nav.label}</td>
				<td class="data-table-td font-mono text-xs text-gray-600">{nav.href}</td>
				<td class="data-table-td text-center">
					{#if nav.requires_auth}<span class="badge badge-blue">Yes</span>{:else}<span class="text-gray-400 text-xs">—</span>{/if}
				</td>
				<td class="data-table-td text-center">
					{#if nav.is_published}<span class="badge badge-green">Yes</span>{:else}<span class="badge badge-gray">No</span>{/if}
				</td>
				<td class="data-table-td text-right">
					<div class="flex justify-end gap-2">
						<a href="/admin/navigation/{nav.id}" class="link-action">Edit</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={nav.id} />
							<button
								type="submit"
								class="link-action-danger"
								onclick={(e) => { if (!confirm(`Delete "${nav.label}"?`)) e.preventDefault(); }}
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
