<script lang="ts">
	import type { SocialComment, SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import SocialAvatar from './SocialAvatar.svelte';

	let {
		comment,
		author,
		isOwn = false,
		ondelete,
	}: {
		comment: SocialComment;
		author: SocialUser;
		isOwn?: boolean;
		ondelete?: () => void;
	} = $props();

	function formatTime(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const mins = Math.floor(diff / 60_000);
		if (mins < 60) return `${mins}m`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h`;
		return `${Math.floor(hrs / 24)}d`;
	}
</script>

<div class="social-comment">
	<SocialAvatar name={author.name} color={author.avatarColor} size="sm" />
	<div class="social-comment-body">
		<div class="social-comment-header">
			<span class="social-comment-author">{author.name}</span>
			<span class="social-comment-time">{formatTime(comment.createdAt)}</span>
			{#if isOwn}
				<button
					type="button"
					class="social-comment-delete link-action-danger ml-auto"
					onclick={ondelete}
				>
					<LocalText slug="social_delete_btn" />
				</button>
			{/if}
		</div>
		<p class="social-comment-content">{comment.content}</p>
	</div>
</div>
