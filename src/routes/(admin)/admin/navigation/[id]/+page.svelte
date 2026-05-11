<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	const dict = getDictionary();

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { navItem } = $derived(data);

	let saving = $state(false);

	const handleSave: SubmitFunction = () => {
		saving = true;
		return async ({ update }) => {
			await update({ reset: false });
			saving = false;
		};
	};
</script>

<svelte:head>
	<title>{dict.localText('page_title_admin_edit_nav')}</title>
</svelte:head>

<div class="max-w-lg space-y-6">
	<div>
		<a href="/admin/navigation" class="back-link">← Back to navigation</a>
		<h1 class="mt-2 page-title">Edit nav item</h1>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}

	<Card>
		<form method="POST" action="?/update" use:enhance={handleSave} class="space-y-4">
			<div>
				<label for="label" class="mb-1 field-label text-gray-700">Label</label>
				<input id="label" name="label" type="text" value={navItem.label} required class="field-control" />
			</div>
			<div>
				<label for="href" class="mb-1 field-label text-gray-700">Href</label>
				<input id="href" name="href" type="text" value={navItem.href} required class="field-control font-mono" />
			</div>
			<div>
				<label for="sort_order" class="mb-1 field-label text-gray-700">Sort order</label>
				<input id="sort_order" name="sort_order" type="number" value={navItem.sort_order} class="field-control" />
			</div>
			<div class="flex flex-col gap-2">
				<label class="flex items-center gap-2 text-sm text-gray-700">
					<input
						type="checkbox"
						name="is_published"
						value="true"
						checked={navItem.is_published}
						class="rounded"
					/>
					Published
				</label>
				<label class="flex items-center gap-2 text-sm text-gray-700">
					<input
						type="checkbox"
						name="requires_auth"
						value="true"
						checked={navItem.requires_auth}
						class="rounded"
					/>
					Requires authentication
				</label>
			</div>
			<div class="flex items-center justify-end gap-3">
				{#if form?.success}
					<span class="text-xs text-green-600">Saved</span>
				{/if}
				<Button type="submit" variant="primary" size="sm" loading={saving}>Save</Button>
			</div>
		</form>
	</Card>

	<Card variant="outlined">
		<h2 class="mb-3 card-title text-red-700">Danger zone</h2>
		<form method="POST" action="?/delete" use:enhance>
			<Button
				type="submit"
				variant="danger"
				size="sm"
				onclick={(e: MouseEvent) => { if (!confirm(`Delete "${navItem.label}"?`)) e.preventDefault(); }}
			>
				Delete nav item
			</Button>
		</form>
	</Card>
</div>
