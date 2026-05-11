<script lang="ts">
	import type { SocialPost, SocialComment, SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faHeart, faComment, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
	import SocialAvatar from './SocialAvatar.svelte';
	import SocialCommentSection from './SocialCommentSection.svelte';
	const dict = getDictionary();

	let {
		post,
		author,
		comments,
		userMap,
		activeUserId,
		onlike,
		onedit,
		ondelete,
		onaddcomment,
		ondeletecomment,
	}: {
		post: SocialPost;
		author: SocialUser;
		comments: SocialComment[];
		userMap: Map<string, SocialUser>;
		activeUserId: string;
		onlike?: (postId: string) => void;
		onedit?: (postId: string, content: string) => void;
		ondelete?: (postId: string) => void;
		onaddcomment?: (postId: string, content: string) => void;
		ondeletecomment?: (commentId: string) => void;
	} = $props();

	let showComments = $state(false);
	let editing = $state(false);
	let editText = $state('');
	let confirmDelete = $state(false);

	const isLiked = $derived(post.likedBy.includes(activeUserId));
	const isOwn = $derived(post.authorId === activeUserId);
	const likeCount = $derived(post.likedBy.length);
	const commentCount = $derived(comments.length);

	const likeLabel = $derived(
		dict.localText('social_likes_label', { count: likeCount }, 'social') ??
			`${likeCount} like${likeCount !== 1 ? 's' : ''}`
	);
	const commentLabel = $derived(
		dict.localText('social_comments_label', { count: commentCount }, 'social') ??
			`${commentCount} comment${commentCount !== 1 ? 's' : ''}`
	);

	function formatTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const mins = Math.floor(diff / 60_000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h`;
		return `${Math.floor(hrs / 24)}d`;
	}

	function startEdit() {
		editText = post.content;
		editing = true;
		confirmDelete = false;
	}

	function saveEdit() {
		const content = editText.trim();
		if (content) onedit?.(post.id, content);
		editing = false;
	}

	function cancelEdit() {
		editing = false;
	}
</script>

<article class="social-post">
	<div class="social-post-header">
		<SocialAvatar name={author.name} color={author.avatarColor} size="md" />
		<div class="social-post-meta">
			<div class="flex items-baseline gap-2">
				<span class="social-post-author">{author.name}</span>
				<span class="social-post-handle">@{author.handle}</span>
				<span class="social-post-time">· {formatTime(post.createdAt)}</span>
			</div>
		</div>
		{#if isOwn}
			<div class="social-post-menu">
				{#if confirmDelete}
					<span class="mr-1 text-xs text-gray-500">
						<LocalText slug="social_delete_confirm" />
					</span>
					<button
						type="button"
						class="social-post-menu-btn text-red-500 hover:bg-red-50 hover:text-red-600"
						onclick={() => { ondelete?.(post.id); confirmDelete = false; }}
					>
						<LocalText slug="social_yes_btn" />
					</button>
					<button
						type="button"
						class="social-post-menu-btn"
						onclick={() => (confirmDelete = false)}
					>
						<LocalText slug="social_no_btn" />
					</button>
				{:else}
					<button
						type="button"
						class="social-post-menu-btn"
						title="Edit"
						onclick={startEdit}
					>
						<Icon icon={faPen} />
					</button>
					<button
						type="button"
						class="social-post-menu-btn hover:text-red-500"
						title="Delete"
						onclick={() => (confirmDelete = true)}
					>
						<Icon icon={faTrash} />
					</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if editing}
		<div class="social-post-edit">
			<textarea
				class="social-post-edit-textarea"
				rows={4}
				bind:value={editText}
			></textarea>
			<div class="social-post-edit-footer">
				<button type="button" class="btn btn-secondary btn-sm" onclick={cancelEdit}>
					<LocalText slug="social_cancel_btn" />
				</button>
				<button
					type="button"
					class="btn btn-primary btn-sm"
					disabled={!editText.trim()}
					onclick={saveEdit}
				>
					<LocalText slug="social_save_btn" />
				</button>
			</div>
		</div>
	{:else}
		<p class="social-post-content">{post.content}</p>
	{/if}

	<div class="social-post-actions">
		<button
			type="button"
			class="social-post-action-btn {isLiked ? 'social-post-action-liked' : ''}"
			onclick={() => onlike?.(post.id)}
		>
			<Icon icon={faHeart} />
			{#if likeCount > 0}
				<span>{likeLabel}</span>
			{:else}
				<LocalText slug="social_like_btn" />
			{/if}
		</button>

		<button
			type="button"
			class="social-post-action-btn {showComments ? 'text-blue-600 hover:text-blue-700' : ''}"
			onclick={() => (showComments = !showComments)}
		>
			<Icon icon={faComment} />
			{#if commentCount > 0}
				<span>{commentLabel}</span>
			{:else}
				<LocalText slug="social_comment_btn" />
			{/if}
		</button>
	</div>

	{#if showComments}
		<SocialCommentSection
			{comments}
			{userMap}
			{activeUserId}
			onaddcomment={(content) => onaddcomment?.(post.id, content)}
			{ondeletecomment}
		/>
	{/if}
</article>
