<script lang="ts">
	import type { SocialComment, SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	import SocialAvatar from './SocialAvatar.svelte';
	import SocialCommentItem from './SocialCommentItem.svelte';
	const dict = getDictionary();

	let {
		comments,
		userMap,
		activeUserId,
		onaddcomment,
		ondeletecomment,
	}: {
		comments: SocialComment[];
		userMap: Map<string, SocialUser>;
		activeUserId: string;
		onaddcomment?: (content: string) => void;
		ondeletecomment?: (commentId: string) => void;
	} = $props();

	let commentText = $state('');

	const activeUser = $derived(userMap.get(activeUserId));

	const placeholder = $derived(
		dict.localText('social_add_comment_placeholder', undefined, 'social') ?? 'Write a comment...'
	);

	function handleSubmit() {
		const text = commentText.trim();
		if (!text) return;
		onaddcomment?.(text);
		commentText = '';
	}
</script>

<div class="social-comment-section">
	{#each comments as comment (comment.id)}
		{@const author = userMap.get(comment.authorId)}
		{#if author}
			<SocialCommentItem
				{comment}
				{author}
				isOwn={comment.authorId === activeUserId}
				ondelete={() => ondeletecomment?.(comment.id)}
			/>
		{/if}
	{/each}

	{#if activeUser}
		<div class="social-comment-form">
			<SocialAvatar name={activeUser.name} color={activeUser.avatarColor} size="sm" />
			<input
				type="text"
				class="social-comment-input"
				{placeholder}
				bind:value={commentText}
				onkeydown={(e) => e.key === 'Enter' && handleSubmit()}
			/>
			<button
				type="button"
				class="btn btn-primary btn-sm"
				disabled={!commentText.trim()}
				onclick={handleSubmit}
			>
				<LocalText slug="social_reply_btn" />
			</button>
		</div>
	{/if}
</div>
