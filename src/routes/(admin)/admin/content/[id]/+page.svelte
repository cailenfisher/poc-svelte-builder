<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { localText } from '$lib/localization/dictionary.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { link, locales, translations } = $derived(data);

	let savingLink = $state(false);
	let savingLocale = $state<number | null>(null);
	let addingTranslation = $state(false);

	type TranslationLocale = {
		id: number;
		code: string;
		name: string;
		native_name: string;
		dir: 'ltr' | 'rtl' | 'auto' | null;
	};
	type Translation = { id: number; content: string; locale: TranslationLocale };
	type Locale = { id: number; code: string; name: string; native_name: string; dir: string | null };

	const existingTranslations = $derived(translations as unknown as Translation[]);

	const populatedLocaleIds = $derived(new Set(existingTranslations.map((t) => t.locale?.id)));

	const availableLocales = $derived(
		(locales as Locale[]).filter((l) => !populatedLocaleIds.has(l.id))
	);

	const handleLink: SubmitFunction = () => {
		savingLink = true;
		return async ({ update }) => {
			await update({ reset: false });
			savingLink = false;
		};
	};

	function handleSave(localeId: number): SubmitFunction {
		return () => {
			savingLocale = localeId;
			return async ({ update }) => {
				await update({ reset: false });
				savingLocale = null;
			};
		};
	}

	const handleAdd: SubmitFunction = () => {
		addingTranslation = true;
		return async ({ update }) => {
			await update();
			addingTranslation = false;
		};
	};
</script>

<svelte:head>
	<title>{localText('page_title_admin_edit_content')}</title>
</svelte:head>

<div class="max-w-2xl space-y-6">
	<div>
		<a href="/admin/content" class="back-link">← Back to content</a>
		<h1 class="page-title mt-2">Edit content link</h1>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}

	<!-- Link metadata -->
	<Card>
		<h2 class="card-title mb-4">Link details</h2>
		<form method="POST" action="?/updateLink" use:enhance={handleLink} class="space-y-4">
			<div>
				<label for="slug" class="field-label mb-1 text-gray-700">Slug</label>
				<input
					id="slug"
					name="slug"
					type="text"
					value={link.slug}
					required
					class="field-control font-mono"
				/>
			</div>
			<div>
				<label for="title" class="field-label mb-1 text-gray-700">Title</label>
				<input
					id="title"
					name="title"
					type="text"
					value={link.title}
					required
					class="field-control"
				/>
			</div>
			<div>
				<label for="scope" class="field-label mb-1 text-gray-700">
					Scope <span class="font-normal text-gray-400">(leave empty for global)</span>
				</label>
				<input
					id="scope"
					name="scope"
					type="text"
					value={link.scope ?? ''}
					placeholder="e.g. profile"
					class="field-control"
				/>
			</div>
			<div class="flex items-center justify-end gap-3">
				{#if form?.success && form.action === 'link'}
					<span class="text-xs text-green-600">Saved</span>
				{/if}
				<Button type="submit" variant="primary" size="sm" loading={savingLink}>Save link</Button>
			</div>
		</form>
	</Card>

	<!-- Existing translations -->
	{#if existingTranslations.length > 0}
		<div class="space-y-3">
			<h2 class="card-title">Translations</h2>
			{#each existingTranslations as t}
				{@const locale = t.locale}
				<Card>
					<div class="mb-3 flex items-start justify-between">
						<div>
							<p class="field-label text-gray-900">{locale.name}</p>
							<p class="mt-0.5 font-mono text-xs text-gray-400">
								{locale.native_name} · {locale.code}
							</p>
						</div>
						<form method="POST" action="?/deleteTranslation" use:enhance>
							<input type="hidden" name="translation_id" value={t.id} />
							<button
								type="submit"
								class="link-action-danger text-xs"
								onclick={(e) => {
									if (!confirm(`Remove the ${locale.name} translation?`)) e.preventDefault();
								}}
							>
								Remove
							</button>
						</form>
					</div>
					<form method="POST" action="?/upsertTranslation" use:enhance={handleSave(locale.id)}>
						<input type="hidden" name="locale_id" value={locale.id} />
						<textarea name="content" rows="2" dir={locale.dir ?? 'ltr'} class="field-control mb-3"
							>{t.content}</textarea
						>
						<div class="flex items-center justify-end gap-3">
							{#if form?.success && form.action === 'translation' && form.savedLocaleId === locale.id}
								<span class="text-xs text-green-600">Saved</span>
							{/if}
							<Button
								type="submit"
								variant="primary"
								size="sm"
								loading={savingLocale === locale.id}
							>
								Save
							</Button>
						</div>
					</form>
				</Card>
			{/each}
		</div>
	{/if}

	<!-- Add translation -->
	{#if availableLocales.length > 0}
		<Card variant="outlined">
			<h2 class="card-title mb-4">Add translation</h2>
			<form method="POST" action="?/upsertTranslation" use:enhance={handleAdd} class="space-y-3">
				<div>
					<label for="add_locale" class="field-label mb-1 text-gray-700">Language</label>
					<select id="add_locale" name="locale_id" class="field-control">
						{#each availableLocales as locale}
							<option value={locale.id}>{locale.name} — {locale.native_name} ({locale.code})</option
							>
						{/each}
					</select>
				</div>
				<div>
					<label for="add_content" class="field-label mb-1 text-gray-700">Content</label>
					<textarea
						id="add_content"
						name="content"
						rows="2"
						class="field-control"
						placeholder="Enter translation…"
					></textarea>
				</div>
				<div class="flex justify-end">
					<Button type="submit" variant="primary" loading={addingTranslation}
						>Add translation</Button
					>
				</div>
			</form>
		</Card>
	{:else if existingTranslations.length === 0}
		<p class="page-subtitle">
			No locales defined yet. <a href="/admin/locale" class="link">Add a locale</a> first.
		</p>
	{/if}
</div>
