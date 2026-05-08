<script lang="ts">
	import BlogCard from './BlogCard.svelte';
	import type { Post } from '$lib/types/blog';

	let { posts }: { posts: Post[] } = $props();
</script>

<div class="blog-feed">
	{#if posts.length === 0}
		<p class="page-subtitle">No posts published yet.</p>
	{:else}
		{#each posts as post}
			<BlogCard {post} />
		{/each}
	{/if}
</div>
