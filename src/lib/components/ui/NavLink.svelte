<script lang="ts">
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import Icon from './Icon.svelte';

	let {
		href,
		label,
		icon = undefined,
		class: className = '',
	}: {
		href: string;
		label: string | Snippet;
		icon?: IconDefinition;
		class?: string;
	} = $props();

	const isActive = $derived($page.url.pathname === href || $page.url.pathname.startsWith(href + '/'));

	const classes = $derived(
		[
			'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
			isActive
				? 'bg-blue-50 text-blue-700'
				: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
			className,
		].join(' ')
	);
</script>

<a {href} class={classes} aria-current={isActive ? 'page' : undefined}>
	{#if icon}
		<Icon {icon} fixedWidth />
	{/if}
	{#if typeof label === 'string'}
		{label}
	{:else}
		{@render label()}
	{/if}
</a>
