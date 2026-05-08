<script lang="ts">
	import type { SocialPost, SocialComment, SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import SocialPostCard from './SocialPost.svelte';

	let {
		posts,
		comments,
		userMap,
		activeUserId,
		onlike,
		onedit,
		ondelete,
		onaddcomment,
		ondeletecomment,
	}: {
		posts: SocialPost[];
		comments: SocialComment[];
		userMap: Map<string, SocialUser>;
		activeUserId: string;
		onlike?: (postId: string) => void;
		onedit?: (postId: string, content: string) => void;
		ondelete?: (postId: string) => void;
		onaddcomment?: (postId: string, content: string) => void;
		ondeletecomment?: (commentId: string) => void;
	} = $props();

	function postComments(postId: string) {
		return comments.filter((c) => c.postId === postId);
	}
</script>

{#if posts.length === 0}
	<div class="rounded-md border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
		<LocalText slug="social_no_posts" />
	</div>
{:else}
	{#each posts as post (post.id)}
		{@const author = userMap.get(post.authorId)}
		{#if author}
			<SocialPostCard
				{post}
				{author}
				comments={postComments(post.id)}
				{userMap}
				{activeUserId}
				{onlike}
				{onedit}
				{ondelete}
				{onaddcomment}
				{ondeletecomment}
			/>
		{/if}
	{/each}
{/if}
