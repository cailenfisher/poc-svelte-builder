<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { link, locales, translations } = $derived(data);

	let savingLink = $state(false);
	let savingTranslations = $state(false);

	type TranslationRow = { locale: { id: number; code: string }[]; content: string };

	function getTranslation(localeId: number): string {
		return (translations as unknown as TranslationRow[])
			.find((t) => t.locale?.[0]?.id === localeId)
			?.content ?? '';
	}

	const handleLink: SubmitFunction = () => {
		savingLink = true;
		return async ({ update }) => { await update(); savingLink = false; };
	};

	const handleTranslations: SubmitFunction = () => {
		savingTranslations = true;
		return async ({ update }) => { await update(); savingTranslations = false; };
	};
</script>

<svelte:head>
	<title>Edit content — Admin</title>
</svelte:head>

<div class="max-w-2xl space-y-6">
	<div>
		<a href="/admin/content" class="back-link">← Back to content</a>
		<h1 class="mt-2 page-title">Edit content link</h1>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}
	{#if form?.success}
		<Alert variant="success">{form.message}</Alert>
	{/if}

	<Card>
		<h2 class="mb-4 card-title">Link details</h2>
		<form method="POST" action="?/updateLink" use:enhance={handleLink} class="space-y-4">
			<div>
				<label for="slug" class="mb-1 field-label text-gray-700">Slug</label>
				<input id="slug" name="slug" type="text" value={link.slug} required class="field-control font-mono" />
			</div>
			<div>
				<label for="title" class="mb-1 field-label text-gray-700">Title</label>
				<input id="title" name="title" type="text" value={link.title} required class="field-control" />
			</div>
			<div>
				<label for="scope" class="mb-1 field-label text-gray-700">
					Scope <span class="font-normal text-gray-400">(leave empty for global)</span>
				</label>
				<input id="scope" name="scope" type="text" value={link.scope ?? ''} placeholder="e.g. profile" class="field-control" />
			</div>
			<div class="flex justify-end">
				<Button type="submit" variant="primary" loading={savingLink}>Save link</Button>
			</div>
		</form>
	</Card>

	<Card>
		<h2 class="mb-4 card-title">Translations</h2>
		{#if locales.length === 0}
			<p class="page-subtitle">
				No locales defined. <a href="/admin/locale" class="link">Add a locale</a> first.
			</p>
		{:else}
			<form method="POST" action="?/upsertTranslations" use:enhance={handleTranslations} class="space-y-5">
				{#each locales as locale}
					<div>
						<label for="content_{locale.id}" class="mb-1 field-label flex items-baseline gap-2 text-gray-700">
							{locale.name}
							<span class="font-normal text-xs text-gray-400">{locale.native_name} · {locale.code}</span>
						</label>
						<textarea
							id="content_{locale.id}"
							name="content_{locale.id}"
							rows="2"
							dir={locale.dir ?? 'ltr'}
							class="field-control"
						>{getTranslation(locale.id)}</textarea>
					</div>
				{/each}
				<div class="flex justify-end">
					<Button type="submit" variant="primary" loading={savingTranslations}>Save translations</Button>
				</div>
			</form>
		{/if}
	</Card>
</div>
