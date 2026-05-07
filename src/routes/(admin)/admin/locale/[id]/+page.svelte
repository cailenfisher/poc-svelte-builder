<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { locale } = $derived(data);

	let saving = $state(false);

	const handleUpdate: SubmitFunction = () => {
		saving = true;
		return async ({ update }) => { await update(); saving = false; };
	};
</script>

<svelte:head>
	<title>Edit locale — Admin</title>
</svelte:head>

<div class="max-w-xl space-y-6">
	<div>
		<a href="/admin/locale" class="back-link">← Back to locales</a>
		<h1 class="mt-2 page-title">Edit locale</h1>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">{form.message}</Alert>
	{/if}

	<Card>
		<form method="POST" action="?/update" use:enhance={handleUpdate} class="space-y-4">
			<div>
				<label for="code" class="mb-1 field-label text-gray-700">Code (BCP 47)</label>
				<input id="code" name="code" type="text" value={locale.code} required class="field-control" />
			</div>
			<div>
				<label for="name" class="mb-1 field-label text-gray-700">English name</label>
				<input id="name" name="name" type="text" value={locale.name} required class="field-control" />
			</div>
			<div>
				<label for="native_name" class="mb-1 field-label text-gray-700">Native name</label>
				<input id="native_name" name="native_name" type="text" value={locale.native_name} required class="field-control" />
			</div>
			<div>
				<label for="dir" class="mb-1 field-label text-gray-700">Text direction</label>
				<select id="dir" name="dir" class="field-control">
					<option value="ltr" selected={locale.dir === 'ltr'}>LTR</option>
					<option value="rtl" selected={locale.dir === 'rtl'}>RTL</option>
					<option value="auto" selected={locale.dir === 'auto'}>Auto</option>
				</select>
			</div>
			<div class="flex justify-end pt-2">
				<Button type="submit" variant="primary" loading={saving}>Save changes</Button>
			</div>
		</form>
	</Card>

	<Card variant="outlined">
		<h2 class="mb-1 card-title">Danger zone</h2>
		<p class="mb-4 page-subtitle">Deleting a locale will remove all translations associated with it.</p>
		<form method="POST" action="?/delete" use:enhance>
			<Button
				type="submit"
				variant="danger"
				onclick={(e) => { if (!confirm('Delete this locale? This cannot be undone.')) e.preventDefault(); }}
			>
				Delete locale
			</Button>
		</form>
	</Card>
</div>
