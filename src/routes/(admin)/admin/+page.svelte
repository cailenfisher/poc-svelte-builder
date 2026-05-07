<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { localText } from '$lib/localization/dictionary.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { stats } = $derived(data);

	let sendingTest = $state(false);
</script>

<svelte:head>
	<title>{localText('page_title_admin_dashboard')}</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="page-title">Dashboard</h1>
		<p class="mt-1 page-subtitle">Overview of your localization content.</p>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}

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

	<Card variant="outlined">
		<h2 class="mb-4 card-title">Test notification</h2>
		<form
			method="POST"
			action="?/testNotification"
			use:enhance={() => {
				sendingTest = true;
				return async ({ update }) => { await update(); sendingTest = false; };
			}}
			class="flex flex-wrap items-end gap-3"
		>
			<div class="flex-1" style="min-width: 14rem">
				<label for="notif_message" class="mb-1 field-label-xs">Message</label>
				<input
					id="notif_message"
					name="message"
					type="text"
					placeholder="Test notification message"
					class="field-control"
				/>
			</div>
			<div>
				<label for="notif_type" class="mb-1 field-label-xs">Type</label>
				<select id="notif_type" name="type" class="field-control">
					<option value="info">Info</option>
					<option value="success">Success</option>
					<option value="warning">Warning</option>
					<option value="error">Error</option>
				</select>
			</div>
			<div class="flex items-center gap-3">
				{#if form?.success && form.action === 'test'}
					<span class="text-xs text-green-600">Sent</span>
				{/if}
				<Button type="submit" variant="primary" size="sm" loading={sendingTest}>Send</Button>
			</div>
		</form>
	</Card>
</div>
