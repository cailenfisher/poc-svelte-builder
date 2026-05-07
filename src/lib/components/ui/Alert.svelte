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

	const variantClasses: Record<string, string> = {
		error:   'bg-red-50 text-red-800 border-red-200',
		warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
		info:    'bg-blue-50 text-blue-800 border-blue-200',
		success: 'bg-green-50 text-green-800 border-green-200',
	};

	const iconClasses: Record<string, string> = {
		error:   'text-red-500',
		warning: 'text-yellow-500',
		info:    'text-blue-500',
		success: 'text-green-500',
	};

	const classes = $derived(
		['flex items-start gap-3 rounded-lg border p-4 text-sm', variantClasses[variant], className].join(' ')
	);
</script>

<div class={classes} role="alert">
	<span class={['mt-0.5 shrink-0', iconClasses[variant]].join(' ')}>
		<Icon icon={icons[variant]} />
	</span>
	<div>
		{@render children?.()}
	</div>
</div>
