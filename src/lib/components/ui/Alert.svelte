<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import {
		faCircleXmark,
		faTriangleExclamation,
		faCircleInfo,
		faCircleCheck,
	} from '@fortawesome/free-solid-svg-icons';

	let {
		variant = 'info',
		class: className = '',
		children,
	}: {
		variant?: 'error' | 'warning' | 'info' | 'success';
		class?: string;
		children?: Snippet;
	} = $props();

	const icons = {
		error:   faCircleXmark,
		warning: faTriangleExclamation,
		info:    faCircleInfo,
		success: faCircleCheck,
	};

	const classes = $derived(['alert', `alert-${variant}`, className].join(' '));
</script>

<div class={classes} role="alert">
	<span class="alert-icon alert-icon-{variant}">
		<Icon icon={icons[variant]} />
	</span>
	<div>
		{@render children?.()}
	</div>
</div>
