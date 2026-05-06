<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		input,
		error = undefined,
		hint = undefined,
		disabled = false,
	}: {
		label: Snippet;
		input: Snippet;
		error?: string | null;
		hint?: string | null;
		disabled?: boolean;
	} = $props();
</script>

<div>
	<div class={['mb-2 text-sm font-medium', disabled ? 'text-gray-400' : 'text-gray-700'].join(' ')}>
		{@render label()}
	</div>
	{@render input()}
	{#if error}
		<p class="mt-1.5 text-sm text-red-600">{error}</p>
	{/if}
	{#if hint}
		<p class="mt-1 text-xs text-gray-400">{hint}</p>
	{/if}
</div>
