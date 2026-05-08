<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import {
		faTable,
		faCircleDot,
		faPlus,
		faDollarSign,
		faBolt,
		faTag,
		faLayerGroup,
		faCircleQuestion,
	} from '@fortawesome/free-solid-svg-icons';

	let { activeSection = 'board' }: { activeSection?: string } = $props();

	const railItems = [
		{ id: 'board', icon: faTable },
		{ id: 'tasks', icon: faCircleDot },
		{ id: 'new', icon: faPlus },
		{ id: 'billing', icon: faDollarSign },
		{ id: 'activity', icon: faBolt },
		{ id: 'tags', icon: faTag },
		{ id: 'layers', icon: faLayerGroup },
	];
</script>

<aside class="pm-icon-rail">
	<div class="pm-icon-rail-brand">A</div>

	<nav class="pm-icon-rail-nav">
		{#each railItems as item}
			<button
				class="pm-icon-btn"
				class:pm-icon-btn-active={item.id === activeSection}
				title={item.id}
			>
				<Icon icon={item.icon} />
			</button>
		{/each}
	</nav>

	<div class="pm-icon-rail-footer">
		<button class="pm-icon-btn" title="Help">
			<Icon icon={faCircleQuestion} />
		</button>
		<div class="pm-icon-rail-avatar">JR</div>
	</div>
</aside>
