<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from '$lib/components/ui/Button.svelte';

	type LocaleRef = {
		id: number;
		code: string;
		name: string;
		native_name: string;
		dir: string | null;
	};

	type Translation = {
		id: number;
		content: string;
		locale: LocaleRef;
	};

	let {
		linkId,
		postId,
		label,
		translations,
		locales,
		form,
		rows = 3
	}: {
		linkId: number;
		postId: number;
		label: string;
		translations: Translation[];
		locales: LocaleRef[];
		form: any;
		rows?: number;
	} = $props();

	let savingLocale = $state<number | null>(null);
	let addingTranslation = $state(false);

	const populatedLocaleIds = $derived(new Set(translations.map((t) => t.locale?.id)));
	const availableLocales = $derived(locales.filter((l) => !populatedLocaleIds.has(l.id)));

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

<div class="space-y-3">
	<h2 class="card-title">{label}</h2>

	{#each translations as t}
		{@const locale = t.locale}
		<div class="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
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
				<input type="hidden" name="link_id" value={linkId} />
				<input type="hidden" name="locale_id" value={locale.id} />
				<input type="hidden" name="scoped_content_id" value={postId} />
				<textarea
					name="content"
					{rows}
					dir={(locale.dir ?? 'ltr') as 'ltr' | 'rtl' | 'auto'}
					class="field-control mb-3"
				>{t.content}</textarea>
				<div class="flex items-center justify-end gap-3">
					{#if form?.success && form.action === 'translation' && form.savedLocaleId === locale.id && form.savedLinkId === linkId}
						<span class="text-xs text-green-600">Saved</span>
					{/if}
					<Button type="submit" variant="primary" size="sm" loading={savingLocale === locale.id}>
						Save
					</Button>
				</div>
			</form>
		</div>
	{/each}

	{#if availableLocales.length > 0}
		<div class="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
			<h3 class="card-title mb-4">Add translation</h3>
			<form method="POST" action="?/upsertTranslation" use:enhance={handleAdd} class="space-y-3">
				<input type="hidden" name="link_id" value={linkId} />
				<input type="hidden" name="scoped_content_id" value={postId} />
				<div>
					<label for="add_locale_{linkId}" class="field-label mb-1 text-gray-700">Language</label>
					<select id="add_locale_{linkId}" name="locale_id" class="field-control">
						{#each availableLocales as locale}
							<option value={locale.id}>{locale.name} — {locale.native_name} ({locale.code})</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="add_content_{linkId}" class="field-label mb-1 text-gray-700">Content</label>
					<textarea
						id="add_content_{linkId}"
						name="content"
						{rows}
						class="field-control"
						placeholder="Enter translation…"
					></textarea>
				</div>
				<div class="flex justify-end">
					<Button type="submit" variant="primary" loading={addingTranslation}>Add translation</Button>
				</div>
			</form>
		</div>
	{:else if translations.length === 0}
		<p class="page-subtitle">
			No locales defined yet. <a href="/admin/locale" class="link">Add a locale</a> first.
		</p>
	{/if}
</div>
