<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import TranslationPanel from '$lib/components/admin/TranslationPanel.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	const dict = getDictionary();

	type BlogLink = { id: number; slug: string; title: string; scope: string | null };
	type LocaleRef = { id: number; code: string; name: string; native_name: string; dir: string | null };
	type Translation = { id: number; content: string; link: number; locale: LocaleRef };

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { post, locales, blogLinks, translations } = $derived(data);

	let savingMeta = $state(false);

	const handleMeta: SubmitFunction = () => {
		savingMeta = true;
		return async ({ update }) => {
			await update({ reset: false });
			savingMeta = false;
		};
	};

	const titleLink = $derived((blogLinks as BlogLink[]).find((l) => l.slug === 'post_title'));
	const excerptLink = $derived((blogLinks as BlogLink[]).find((l) => l.slug === 'post_excerpt'));
	const bodyLink = $derived((blogLinks as BlogLink[]).find((l) => l.slug === 'post_body'));

	function translationsForLink(linkId: number): Translation[] {
		return (translations as Translation[]).filter((t) => t.link === linkId);
	}

	//# datetime-local input requires value in "YYYY-MM-DDTHH:mm" format
	function toDatetimeLocal(value: string | null): string {
		if (!value) return '';
		return new Date(value).toISOString().slice(0, 16);
	}
</script>

<svelte:head>
	<title>{dict.localText('page_title_admin_edit_post')}</title>
</svelte:head>

<div class="max-w-2xl space-y-6">
	<div>
		<a href="/admin/blog" class="back-link">← Back to blog</a>
		<h1 class="mt-2 page-title">Edit post</h1>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}

	<Card>
		<h2 class="mb-4 card-title">Post details</h2>
		<form method="POST" action="?/updateMeta" use:enhance={handleMeta} class="space-y-4">
			<div>
				<label for="slug" class="field-label mb-1 text-gray-700">Slug</label>
				<input
					id="slug"
					name="slug"
					type="text"
					value={post.slug}
					required
					class="field-control font-mono"
				/>
			</div>
			<div class="flex items-center gap-3">
				<input
					id="is_published"
					name="is_published"
					type="checkbox"
					checked={post.is_published}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="is_published" class="field-label text-gray-700">Published</label>
			</div>
			<div>
				<label for="published_at" class="field-label mb-1 text-gray-700">Published at</label>
				<input
					id="published_at"
					name="published_at"
					type="datetime-local"
					value={toDatetimeLocal(post.published_at)}
					class="field-control"
				/>
			</div>
			<div class="flex items-center justify-end gap-3">
				{#if form?.success && form.action === 'meta'}
					<span class="text-xs text-green-600">Saved</span>
				{/if}
				<Button type="submit" variant="primary" size="sm" loading={savingMeta}>Save</Button>
			</div>
		</form>
	</Card>

	{#if titleLink}
		<TranslationPanel
			linkId={titleLink.id}
			postId={post.id}
			label="Title"
			translations={translationsForLink(titleLink.id)}
			locales={locales as LocaleRef[]}
			{form}
			rows={1}
		/>
	{/if}

	{#if excerptLink}
		<TranslationPanel
			linkId={excerptLink.id}
			postId={post.id}
			label="Excerpt"
			translations={translationsForLink(excerptLink.id)}
			locales={locales as LocaleRef[]}
			{form}
			rows={3}
		/>
	{/if}

	{#if bodyLink}
		<TranslationPanel
			linkId={bodyLink.id}
			postId={post.id}
			label="Body"
			translations={translationsForLink(bodyLink.id)}
			locales={locales as LocaleRef[]}
			{form}
			rows={8}
		/>
	{/if}
</div>
