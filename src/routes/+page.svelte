<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeDictionary } from '$lib/localization/dictionary.svelte';
	import type { PageData } from './$types';
	import BlogFeed from '$lib/components/universal/Blog/BlogFeed.svelte';
	import HomeHero from '$lib/components/universal/HomeHero.svelte';
	import DemoBanner from '$lib/components/universal/DemoBanner.svelte';
	import type { Post } from '$lib/types/blog';

	let { data }: { data: PageData } = $props();
	let { posts, blogContent } = $derived(data);

	$effect(() => {
		const content = blogContent;
		if (content?.length) untrack(() => mergeDictionary(content));
	});
</script>

<HomeHero />
<DemoBanner />
<BlogFeed posts={posts as unknown as Post[]} />
