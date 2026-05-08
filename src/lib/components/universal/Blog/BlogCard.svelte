<script lang="ts">
	import LocalText from '$lib/localization/LocalText.svelte';
	import LocalDate from '$lib/localization/LocalDate.svelte';
	import type { Post } from '$lib/types/blog';

	let { post }: { post: Post } = $props();
</script>

<a href="/blog/{post.slug}" class="blog-card">
	<h2 class="blog-card-title">
		<LocalText slug="post_title" scope="blog" contentId={post.id} />
	</h2>
	<p class="blog-card-excerpt">
		<LocalText slug="post_excerpt" scope="blog" contentId={post.id} />
	</p>
	<p class="blog-card-date">
		<LocalDate value={post.published_at ?? post.created_at} />
	</p>
</a>
