<script lang="ts">
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
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

	const isActive = $derived(page.url.pathname === href || page.url.pathname.startsWith(href + '/'));
	const classes = $derived(['nav-link', isActive ? 'nav-link-active' : '', className].filter(Boolean).join(' '));
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
