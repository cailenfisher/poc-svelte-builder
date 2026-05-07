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
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Locales</h1>
			<p class="mt-1 text-sm text-gray-500">Manage supported languages and regions.</p>
		</div>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">Locale created successfully.</Alert>
	{/if}

	<!-- Create form -->
	<Card>
		<h2 class="mb-4 text-base font-semibold text-gray-900">Add locale</h2>
		<form method="POST" action="?/create" use:enhance={() => {
			creating = true;
			return async ({ update }) => { await update(); creating = false; };
		}} class="grid grid-cols-1 gap-3 sm:grid-cols-4">
			<div>
				<label for="code" class="mb-1 block text-xs font-medium text-gray-600">Code (BCP 47)</label>
				<input
					id="code"
					name="code"
					type="text"
					placeholder="en-US"
					required
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="name" class="mb-1 block text-xs font-medium text-gray-600">English name</label>
				<input
					id="name"
					name="name"
					type="text"
					placeholder="English"
					required
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="native_name" class="mb-1 block text-xs font-medium text-gray-600">Native name</label>
				<input
					id="native_name"
					name="native_name"
					type="text"
					placeholder="English"
					required
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="dir" class="mb-1 block text-xs font-medium text-gray-600">Direction</label>
				<select
					id="dir"
					name="dir"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				>
					<option value="ltr">LTR</option>
					<option value="rtl">RTL</option>
					<option value="auto">Auto</option>
				</select>
			</div>
			<div class="sm:col-span-4 flex justify-end">
				<Button type="submit" variant="primary" loading={creating}>Add locale</Button>
			</div>
		</form>
	</Card>

	<!-- List -->
	<DataTable items={locales as unknown as Record<string, unknown>[]} {columns} filterFn={filterLocales as (item: Record<string, unknown>, q: string) => boolean}>
		{#snippet row(item)}
			{@const locale = item as unknown as Locale}
			<tr class="hover:bg-gray-50">
				<td class="px-4 py-3 font-mono text-xs text-gray-600">{locale.code}</td>
				<td class="px-4 py-3 text-gray-900">{locale.name}</td>
				<td class="px-4 py-3 text-gray-600">{locale.native_name}</td>
				<td class="px-4 py-3 text-gray-500">{locale.dir ?? '—'}</td>
				<td class="px-4 py-3 text-right">
					<div class="flex justify-end gap-2">
						<a href="/admin/locale/{locale.id}" class="text-sm text-blue-600 hover:underline">Edit</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={locale.id} />
							<button
								type="submit"
								class="text-sm text-red-500 hover:underline"
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
