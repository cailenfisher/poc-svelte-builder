<script lang="ts">
	import { getContentBySlug } from '$lib/localization/dictionary.svelte';
	import AvatarPlaceholder from './AvatarPlaceholder.svelte';

	let { user } = $props();

	const profileImage = $derived(user.user_metadata.avatar_url ?? null);
	const profileImageLabel = getContentBySlug('profile_image')?.content ?? 'Avatar';
</script>

<div class="flex items-center gap-2.5">
	{#if profileImage}
		<img class="h-10 w-10 rounded-full" src={profileImage} alt={profileImageLabel} />
	{:else}
		<AvatarPlaceholder />
	{/if}
	<div class="text-heading font-medium">
		{user.email}
	</div>
</div>
