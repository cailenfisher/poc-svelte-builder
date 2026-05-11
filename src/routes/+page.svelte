<script lang="ts">
	import { untrack } from 'svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	import type { PageData } from './$types';
	import BlogFeed from '$lib/components/universal/Blog/BlogFeed.svelte';
	import HomeHero from '$lib/components/universal/HomeHero.svelte';
	import DemoBanner from '$lib/components/universal/DemoBanner.svelte';
	import type { Post } from '$lib/types/blog';

	const dict = getDictionary();

	let { data }: { data: PageData } = $props();
	let { posts, blogContent } = $derived(data);

	$effect(() => {
		const content = blogContent;
		if (content?.length) untrack(() => dict.mergeDictionary(content));
	});
</script>

<HomeHero />
<DemoBanner />
<section class="border-b border-gray-200 bg-gray-50 px-6 py-12">
	<div class="mx-auto max-w-5xl">
		<div class="mb-8">
			<h2 class="mb-1.5 text-xl font-bold text-gray-900">SB Updates</h2>
			<BlogFeed posts={posts as unknown as Post[]} />
		</div>
	</div>
</section>
