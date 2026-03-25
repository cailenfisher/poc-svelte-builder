<script lang="ts">
	import { getContentBySlug } from './dictionary.svelte';
	let { slug } = $props();
	let local_content = $derived(getContentBySlug(slug));
</script>

{#if local_content}
	<div class="p-1" dir={local_content.locale.dir}>
		{local_content.content}
	</div>
{:else}
	<div class="p-1 text-red-500">Missing localized content: {slug}</div>
{/if}
