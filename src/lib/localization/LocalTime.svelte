<script lang="ts">
	import { getActiveLocaleCode } from './dictionary.svelte';
	import { formatTime } from './localize';
	import type { TimeStyle } from './localize';

	let {
		value,
		style = 'short',
		locale = undefined,
	}: {
		value: Date | string;
		style?: TimeStyle;
		locale?: string;
	} = $props();

	const activeLocale = $derived(locale ?? getActiveLocaleCode());
	const formatted = $derived(formatTime(value, activeLocale, style));
</script>

<time datetime={typeof value === 'string' ? value : value.toISOString()}>{formatted}</time>
