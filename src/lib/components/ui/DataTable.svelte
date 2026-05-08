<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import { faChevronUp, faChevronDown, faSort } from '@fortawesome/free-solid-svg-icons';
	import Icon from './Icon.svelte';

	type Column = {
		key: keyof T;
		label: string;
		sortable?: boolean;
	};

	let {
		items,
		columns,
		row,
		emptyState = undefined,
		filterFn = undefined,
		pageSize = 20,
	}: {
		items: T[];
		columns: Column[];
		row: Snippet<[T]>;
		emptyState?: Snippet;
		filterFn?: (item: T, query: string) => boolean;
		pageSize?: number;
	} = $props();

	let query = $state('');
	let currentPage = $state(1);
	let sortKey = $state<keyof T | null>(null);
	let sortAsc = $state(true);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q || !filterFn) return items;
		return items.filter((item) => filterFn(item, q));
	});

	const sorted = $derived.by(() => {
		const key = sortKey;
		if (!key) return filtered;
		return [...filtered].sort((a, b) => {
			const av = a[key] ?? '';
			const bv = b[key] ?? '';
			const cmp = String(av).localeCompare(String(bv));
			return sortAsc ? cmp : -cmp;
		});
	});

	const totalPages = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));
	const paged = $derived(sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	function toggleSort(key: keyof T) {
		if (sortKey === key) {
			sortAsc = !sortAsc;
		} else {
			sortKey = key;
			sortAsc = true;
		}
		currentPage = 1;
	}

	$effect(() => {
		query;
		currentPage = 1;
	});
</script>

<div class="space-y-3">
	{#if filterFn}
		<input
			type="search"
			bind:value={query}
			placeholder="Search…"
			class="field-control"
		/>
	{/if}

	<div class="data-table-wrapper">
		<table class="data-table">
			<thead class="data-table-head">
				<tr>
					{#each columns as col}
						<th scope="col" class="data-table-th">
							{#if col.sortable}
								<button type="button" onclick={() => toggleSort(col.key)} class="data-table-sort-btn">
									{col.label}
									{#if sortKey === col.key}
										<Icon icon={sortAsc ? faChevronUp : faChevronDown} class="text-blue-500" />
									{:else}
										<Icon icon={faSort} class="text-gray-300" />
									{/if}
								</button>
							{:else}
								{col.label}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#if paged.length === 0}
					<tr>
						<td colspan={columns.length} class="data-table-empty">
							{#if emptyState}
								{@render emptyState()}
							{:else}
								No results found.
							{/if}
						</td>
					</tr>
				{:else}
					{#each paged as item}
						{@render row(item)}
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	{#if totalPages > 1}
		<div class="flex items-center justify-between text-sm text-gray-500">
			<span>{sorted.length} result{sorted.length === 1 ? '' : 's'}</span>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => (currentPage = Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					class="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Previous
				</button>
				<span>Page {currentPage} of {totalPages}</span>
				<button
					type="button"
					onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
					class="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Next
				</button>
			</div>
		</div>
	{/if}
</div>
