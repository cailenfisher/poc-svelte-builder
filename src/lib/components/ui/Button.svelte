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
	const classes = $derived(['btn', `btn-${variant}`, `btn-${size}`, className].join(' '));
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
