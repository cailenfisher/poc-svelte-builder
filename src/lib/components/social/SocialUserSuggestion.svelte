<script lang="ts">
	import type { SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import SocialAvatar from './SocialAvatar.svelte';

	let {
		user,
		isFollowing = false,
		onfollow,
	}: {
		user: SocialUser;
		isFollowing?: boolean;
		onfollow?: () => void;
	} = $props();
</script>

<div class="social-suggestion">
	<SocialAvatar name={user.name} color={user.avatarColor} size="sm" />
	<div class="social-suggestion-info">
		<p class="social-suggestion-name">{user.name}</p>
		<p class="social-suggestion-handle">@{user.handle}</p>
	</div>
	<button
		type="button"
		class={isFollowing ? 'social-following-btn' : 'social-follow-btn'}
		onclick={onfollow}
	>
		{#if isFollowing}
			<LocalText slug="social_following_btn" />
		{:else}
			<LocalText slug="social_follow_btn" />
		{/if}
	</button>
</div>
