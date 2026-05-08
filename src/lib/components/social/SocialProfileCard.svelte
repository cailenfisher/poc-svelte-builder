<script lang="ts">
	import type { SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import SocialAvatar from './SocialAvatar.svelte';

	let {
		user,
		postsCount = 0,
	}: {
		user: SocialUser;
		postsCount?: number;
	} = $props();
</script>

<div class="social-sidebar-card">
	<div class="social-profile-cover"></div>
	<div class="social-profile-body">
		<div class="social-profile-avatar-wrap">
			<SocialAvatar name={user.name} color={user.avatarColor} size="xl" />
		</div>
		<p class="social-profile-name">{user.name}</p>
		<p class="social-profile-handle">@{user.handle}</p>
		<p class="social-profile-bio">{user.bio}</p>
		<div class="social-profile-stats">
			<div class="social-profile-stat flex flex-col">
				<span class="social-profile-stat-number">{postsCount}</span>
				<span class="social-profile-stat-label">Posts</span>
			</div>
			<div class="social-profile-stat flex flex-col">
				<span class="social-profile-stat-number">{user.followersCount.toLocaleString()}</span>
				<span class="social-profile-stat-label">
					<LocalText slug="social_followers_label" />
				</span>
			</div>
			<div class="social-profile-stat flex flex-col">
				<span class="social-profile-stat-number">{user.followingCount.toLocaleString()}</span>
				<span class="social-profile-stat-label">
					<LocalText slug="social_following_label" />
				</span>
			</div>
		</div>
	</div>
</div>
