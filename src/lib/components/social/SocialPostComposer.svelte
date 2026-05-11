<script lang="ts">
	import type { SocialUser } from '$lib/types/social';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	import SocialAvatar from './SocialAvatar.svelte';
	const dict = getDictionary();

	const MAX_CHARS = 280;

	let {
		activeUser,
		onpost,
	}: {
		activeUser: SocialUser;
		onpost?: (content: string) => void;
	} = $props();

	let text = $state('');
	const remaining = $derived(MAX_CHARS - text.length);
	const overLimit = $derived(remaining < 0);
	const canPost = $derived(text.trim().length > 0 && !overLimit);

	const placeholder = $derived(
		dict.localText('social_compose_placeholder', undefined, 'social') ?? "What's on your mind?"
	);

	function handlePost() {
		const content = text.trim();
		if (!content || overLimit) return;
		onpost?.(content);
		text = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost();
	}
</script>

<div class="social-compose">
	<div class="social-compose-row">
		<SocialAvatar name={activeUser.name} color={activeUser.avatarColor} size="md" />
		<textarea
			class="social-compose-textarea"
			rows={3}
			{placeholder}
			bind:value={text}
			onkeydown={handleKeydown}
		></textarea>
	</div>
	<div class="social-compose-footer">
		<span class="social-compose-count {overLimit ? 'text-red-500' : ''}">{remaining}</span>
		<button type="button" class="btn btn-primary btn-sm" disabled={!canPost} onclick={handlePost}>
			<LocalText slug="social_post_btn" />
		</button>
	</div>
</div>
