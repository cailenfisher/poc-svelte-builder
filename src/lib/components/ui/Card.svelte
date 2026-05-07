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

	const variantClasses: Record<string, string> = {
		default:  'rounded-lg bg-white shadow-md',
		outlined: 'rounded-lg border border-gray-200 bg-white shadow-md',
	};

	const classes = $derived([variantClasses[variant], padding, className].join(' '));
</script>

<div class={classes}>
	{@render children?.()}
</div>
