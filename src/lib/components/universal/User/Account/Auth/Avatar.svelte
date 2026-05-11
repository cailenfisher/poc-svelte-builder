<script lang="ts">
	import { getDictionary } from '$lib/localization/context.svelte';
	import AvatarPlaceholder from './AvatarPlaceholder.svelte';
	const dict = getDictionary();

	let { user } = $props();

	const profileImage = $derived(user.user_metadata.avatar_url ?? null);
	let profileImageLabel = $derived(dict.getContentBySlug('profile_image')?.content ?? 'Avatar');
</script>

<div class="flex items-center gap-2.5">
	{#if profileImage}
		<img class="avatar h-10 w-10" src={profileImage} alt={profileImageLabel} />
	{:else}
		<AvatarPlaceholder />
	{/if}
	<div class="text-sm font-medium text-gray-700">{user.email}</div>
</div>
