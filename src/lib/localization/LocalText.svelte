<script lang="ts">
	import { getContent, localText } from './dictionary.svelte';

	let {
		slug,
		scope = undefined,
		contentId = undefined,
		values = undefined
	}: {
		slug: string;
		scope?: string | null;
		contentId?: number | null;
		values?: Record<string, unknown>;
	} = $props();

	let local_content = $derived(getContent(slug, scope, contentId));
	let formatted = $derived(local_content ? localText(slug, values, scope, contentId) : undefined);
</script>

{#if local_content && formatted !== undefined}
	<span dir={local_content.locale.dir}>{formatted}</span>
{:else}
	<span class="text-red-500">Missing localized content: {slug}</span>
{/if}
