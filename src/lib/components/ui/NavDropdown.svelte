<script lang="ts">
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Icon from './Icon.svelte';

	let {
		label,
		icon = undefined,
		defaultOpen = false,
		children,
	}: {
		label: string;
		icon?: IconDefinition;
		defaultOpen?: boolean;
		children?: Snippet;
	} = $props();

	let open = $state(untrack(() => defaultOpen));
</script>

<div>
	<button type="button" onclick={() => (open = !open)} class="nav-dropdown-btn">
		{#if icon}
			<Icon {icon} fixedWidth />
		{/if}
		<span class="flex-1 text-left">{label}</span>
		<Icon icon={open ? faChevronDown : faChevronRight} class="text-gray-400" />
	</button>
	{#if open}
		<div class="ml-6 mt-0.5 space-y-0.5">
			{@render children?.()}
		</div>
	{/if}
</div>
