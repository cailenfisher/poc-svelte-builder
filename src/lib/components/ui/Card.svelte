<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		padding = 'p-6',
		class: className = '',
		children,
	}: {
		variant?: 'default' | 'outlined';
		padding?: string;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived([variant === 'outlined' ? 'card-outlined' : 'card', padding, className].join(' '));
</script>

<div class={classes}>
	{@render children?.()}
</div>
