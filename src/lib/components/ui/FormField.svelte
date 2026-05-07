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
	<div class="mb-2 field-label {disabled ? 'text-gray-400' : 'text-gray-700'}">
		{@render label()}
	</div>
	{@render input()}
	{#if error}
		<p class="field-error">{error}</p>
	{/if}
	{#if hint}
		<p class="field-hint">{hint}</p>
	{/if}
</div>
