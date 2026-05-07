<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import { faSpinner } from '@fortawesome/free-solid-svg-icons';

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		href = undefined,
		type = 'button',
		class: className = '',
		children,
		onclick,
	}: {
		variant?: 'primary' | 'secondary' | 'danger';
		size?: 'sm' | 'md';
		loading?: boolean;
		disabled?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const isDisabled = $derived(disabled || loading);

	const variantClasses: Record<string, string> = {
		primary:   'border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
		secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-100',
		danger:    'border border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-5 py-2.5 text-sm',
	};

	const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

	const classes = $derived([base, variantClasses[variant], sizeClasses[size], className].join(' '));
</script>

{#if href}
	<a
		{href}
		class={classes}
		aria-disabled={isDisabled}
		tabindex={isDisabled ? -1 : undefined}
		onclick={isDisabled ? (e) => e.preventDefault() : onclick}
	>
		{#if loading}<Icon icon={faSpinner} spin />{/if}
		{@render children?.()}
	</a>
{:else}
	<button {type} disabled={isDisabled} class={classes} {onclick}>
		{#if loading}<Icon icon={faSpinner} spin />{/if}
		{@render children?.()}
	</button>
{/if}
