<script lang="ts">
	import { getActiveLocaleCode } from './dictionary.svelte';
	import { formatDate } from './localize';
	import type { DateStyle } from './localize';

	let {
		value,
		style = 'medium',
		locale = undefined,
	}: {
		value: Date | string;
		style?: DateStyle;
		locale?: string;
	} = $props();

	const activeLocale = $derived(locale ?? getActiveLocaleCode());
	const formatted = $derived(formatDate(value, activeLocale, style));
</script>

<time datetime={typeof value === 'string' ? value : value.toISOString()}>{formatted}</time>
