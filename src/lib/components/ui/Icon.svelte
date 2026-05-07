<script lang="ts">
	import { icon as buildIcon } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css';
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

	let {
		icon,
		class: className = '',
		spin = false,
		fixedWidth = false,
	}: {
		icon: IconDefinition;
		class?: string;
		spin?: boolean;
		fixedWidth?: boolean;
	} = $props();

	const svgHtml = $derived.by(() => {
		const classes: string[] = [];
		if (spin) classes.push('fa-spin');
		if (fixedWidth) classes.push('fa-fw');
		if (className) classes.push(...className.split(' ').filter(Boolean));
		return buildIcon(icon, { classes })?.html?.[0] ?? '';
	});
</script>

{@html svgHtml}
