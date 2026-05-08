<script lang="ts">
	import { page } from '$app/stores';
	import type { SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { activeUser as appUser } from '$lib/applicationState/activeUser.svelte';
	import {
		posts,
		comments,
		socialUsers,
		socialUserMap,
		followingIds,
		addPost,
		updatePost,
		removePost,
		toggleLike,
		addComment,
		removeComment,
		toggleFollow,
	} from '$lib/stores/social.svelte';
	import SocialPostComposer from '$lib/components/social/SocialPostComposer.svelte';
	import SocialFeed from '$lib/components/social/SocialFeed.svelte';
	import SocialSidebar from '$lib/components/social/SocialSidebar.svelte';

	// Build a SocialUser from the Supabase session, or fall back to the demo user (u1).
	const activeSocialUser = $derived.by<SocialUser>(() => {
		const user = $page.data.user;
		if (user) {
			const name =
				appUser?.displayName ??
				(user.user_metadata?.full_name as string | undefined) ??
				user.email?.split('@')[0] ??
				'You';
			const handle =
				user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? 'you';
			return {
				id: user.id,
				name,
				handle,
				avatarColor: 'bg-indigo-600',
				bio: user.email ?? '',
				followersCount: 0,
				followingCount: 0,
			};
		}
		// No session — demo mode, view as Alex Chen
		return socialUserMap.get('u1')!;
	});

	const activeUserId = $derived(activeSocialUser.id);

	// Extend the static seed map with the real user so their posts/comments resolve.
	const fullUserMap = $derived.by(() => {
		const user = $page.data.user;
		if (!user) return socialUserMap;
		const map = new Map(socialUserMap);
		map.set(user.id, activeSocialUser);
		return map;
	});

	// Show all fake users as suggestions (the real user is separate from the seed set).
	const suggestions = $derived(socialUsers);
</script>

<div class="social-shell">
	<header class="social-topbar">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
			<div>
				<h1 class="page-title"><LocalText slug="social_page_title" /></h1>
				<p class="page-subtitle"><LocalText slug="social_page_subtitle" /></p>
			</div>
			<div class="flex items-center gap-2 text-xs text-gray-500">
				Viewing as
				<span class="font-semibold text-gray-800">{activeSocialUser.name}</span>
				{#if !$page.data.user}
					<span class="badge badge-gray">demo</span>
				{/if}
			</div>
		</div>
	</header>

	<div class="social-body">
		<main class="social-main">
			<SocialPostComposer
				activeUser={activeSocialUser}
				onpost={(content) => addPost(content, activeUserId)}
			/>

			<SocialFeed
				{posts}
				{comments}
				userMap={fullUserMap}
				{activeUserId}
				onlike={(postId) => toggleLike(postId, activeUserId)}
				onedit={(postId, content) => updatePost(postId, content)}
				ondelete={(postId) => removePost(postId)}
				onaddcomment={(postId, content) => addComment(postId, content, activeUserId)}
				ondeletecomment={(commentId) => removeComment(commentId)}
			/>
		</main>

		<div class="social-sidebar">
			<SocialSidebar
				activeUser={activeSocialUser}
				{suggestions}
				followingIds={followingIds}
				{posts}
				onfollow={(userId) => toggleFollow(userId)}
			/>
		</div>
	</div>
</div>
