<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	type Locale = {
		id: number;
		code: string;
		name: string;
		native_name: string;
		dir: string | null;
	};

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { locales } = $derived(data);

	let creating = $state(false);

	const columns = [
		{ key: 'code' as keyof Locale, label: 'Code', sortable: true },
		{ key: 'name' as keyof Locale, label: 'Name', sortable: true },
		{ key: 'native_name' as keyof Locale, label: 'Native name', sortable: true },
		{ key: 'dir' as keyof Locale, label: 'Direction' },
	];

	function filterLocales(item: Locale, query: string): boolean {
		return (
			item.code.toLowerCase().includes(query) ||
			item.name.toLowerCase().includes(query) ||
			item.native_name.toLowerCase().includes(query)
		);
	}
</script>

<svelte:head>
	<title>Locales — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="page-title">Locales</h1>
		<p class="mt-1 page-subtitle">Manage supported languages and regions.</p>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">Locale created successfully.</Alert>
	{/if}

	<Card>
		<h2 class="mb-4 card-title">Add locale</h2>
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
				<label for="code" class="mb-1 field-label-xs">Code (BCP 47)</label>
				<input id="code" name="code" type="text" placeholder="en-US" required class="field-control" />
			</div>
			<div>
				<label for="name" class="mb-1 field-label-xs">English name</label>
				<input id="name" name="name" type="text" placeholder="English" required class="field-control" />
			</div>
			<div>
				<label for="native_name" class="mb-1 field-label-xs">Native name</label>
				<input id="native_name" name="native_name" type="text" placeholder="English" required class="field-control" />
			</div>
			<div>
				<label for="dir" class="mb-1 field-label-xs">Direction</label>
				<select id="dir" name="dir" class="field-control">
					<option value="ltr">LTR</option>
					<option value="rtl">RTL</option>
					<option value="auto">Auto</option>
				</select>
			</div>
			<div class="flex justify-end sm:col-span-4">
				<Button type="submit" variant="primary" loading={creating}>Add locale</Button>
			</div>
		</form>
	</Card>

	<DataTable
		items={locales as unknown as Record<string, unknown>[]}
		{columns}
		filterFn={filterLocales as (item: Record<string, unknown>, q: string) => boolean}
	>
		{#snippet row(item)}
			{@const locale = item as unknown as Locale}
			<tr class="data-table-row">
				<td class="data-table-td font-mono text-xs text-gray-600">{locale.code}</td>
				<td class="data-table-td text-gray-900">{locale.name}</td>
				<td class="data-table-td text-gray-600">{locale.native_name}</td>
				<td class="data-table-td text-gray-500">{locale.dir ?? '—'}</td>
				<td class="data-table-td text-right">
					<div class="flex justify-end gap-2">
						<a href="/admin/locale/{locale.id}" class="link-action">Edit</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={locale.id} />
							<button
								type="submit"
								class="link-action-danger"
								onclick={(e) => { if (!confirm(`Delete "${locale.name}"?`)) e.preventDefault(); }}
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
