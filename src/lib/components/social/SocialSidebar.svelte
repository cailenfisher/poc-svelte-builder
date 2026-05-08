<script lang="ts">
	import type { SocialUser, SocialPost } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import SocialProfileCard from './SocialProfileCard.svelte';
	import SocialUserSuggestion from './SocialUserSuggestion.svelte';

	const TRENDING = [
		{ tag: '#SvelteKit', count: '2.4k posts' },
		{ tag: '#TypeScript', count: '18.1k posts' },
		{ tag: '#OpenSource', count: '9.7k posts' },
		{ tag: '#WebPerf', count: '3.2k posts' },
		{ tag: '#PostgreSQL', count: '5.8k posts' },
	];

	let {
		activeUser,
		suggestions,
		followingIds,
		posts,
		onfollow,
	}: {
		activeUser: SocialUser;
		suggestions: SocialUser[];
		followingIds: string[];
		posts: SocialPost[];
		onfollow?: (userId: string) => void;
	} = $props();

	const myPostsCount = $derived(posts.filter((p) => p.authorId === activeUser.id).length);
</script>

<aside>
	<SocialProfileCard user={activeUser} postsCount={myPostsCount} />

	<div class="social-sidebar-card">
		<div class="px-4 pt-3">
			<p class="social-sidebar-title">
				<LocalText slug="social_suggestions_heading" />
			</p>
		</div>
		{#each suggestions as user (user.id)}
			<SocialUserSuggestion
				{user}
				isFollowing={followingIds.includes(user.id)}
				onfollow={() => onfollow?.(user.id)}
			/>
		{/each}
	</div>

	<div class="social-sidebar-card">
		<div class="px-4 pt-3 pb-1">
			<p class="social-sidebar-title">
				<LocalText slug="social_trending_heading" />
			</p>
		</div>
		{#each TRENDING as trend}
			<div class="social-trend">
				<p class="social-trend-tag">{trend.tag}</p>
				<p class="social-trend-count">{trend.count}</p>
			</div>
		{/each}
	</div>
</aside>
