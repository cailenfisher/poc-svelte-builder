<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeDictionary, localText } from '$lib/localization/dictionary.svelte';
	import type { PageData } from './$types';
	import type { Post } from '$lib/types/blog';
	import LocalText from '$lib/localization/LocalText.svelte';
	import LocalDate from '$lib/localization/LocalDate.svelte';

	let { data }: { data: PageData } = $props();
	let { post, blogContent } = $derived(data);
	const typedPost = $derived(post as unknown as Post);

	$effect(() => {
		const content = blogContent;
		if (content?.length) untrack(() => mergeDictionary(content));
	});
</script>

<svelte:head>
	<title>{localText('post_title', undefined, 'blog', typedPost.id)}</title>
</svelte:head>

<article class="mx-auto max-w-2xl space-y-6">
	<div>
		<a href="/" class="back-link">← Home</a>
		<h1 class="mt-2 page-title">
			<LocalText slug="post_title" scope="blog" contentId={typedPost.id} />
		</h1>
		<p class="mt-1 page-subtitle">
			<LocalDate value={typedPost.published_at ?? typedPost.created_at} />
		</p>
	</div>

	<div class="blog-post-body">
		<LocalText slug="post_body" scope="blog" contentId={typedPost.id} />
	</div>
</article>
