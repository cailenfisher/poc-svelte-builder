<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import {
		faCircle,
		faPlus,
		faMagnifyingGlass,
		faXmark,
	} from '@fortawesome/free-solid-svg-icons';

	type NavWorkspace = { id: number; pinned: boolean };

	let {
		navWorkspaces = [],
		activeNavItem = 'all_workspaces',
	}: {
		navWorkspaces?: NavWorkspace[];
		activeNavItem?: string;
	} = $props();

	const navFilters = [
		{ id: 'all_workspaces', slug: 'pm_nav_all_workspaces' },
		{ id: 'active', slug: 'pm_nav_active' },
		{ id: 'suspended', slug: 'pm_nav_suspended' },
		{ id: 'recently_created', slug: 'pm_nav_recently_created' },
		{ id: 'pinned', slug: 'pm_nav_pinned_filter' },
		{ id: 'tags', slug: 'pm_nav_tags' },
		{ id: 'saved_views', slug: 'pm_nav_saved_views' },
	];

	const pinnedWorkspaces = $derived(navWorkspaces.filter((w) => w.pinned));
</script>

<aside class="pm-subnav">
	<div class="pm-subnav-header">
		<div class="flex items-center gap-1.5">
			<span class="text-sm font-semibold text-gray-900">
				<LocalText slug="pm_section_workspaces" scope="pm" />
			</span>
			<span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
				{navWorkspaces.length}
			</span>
		</div>
		<button class="pm-icon-btn h-6 w-6 rounded" title="Close">
			<Icon icon={faXmark} />
		</button>
	</div>

	<div class="pm-subnav-body">
		<!-- Filter input -->
		<div class="mb-2 flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5">
			<div class="flex items-center gap-2 text-xs text-gray-400">
				<Icon icon={faMagnifyingGlass} class="text-[11px]" />
				<LocalText slug="pm_filter_workspaces" scope="pm" />
			</div>
			<kbd class="rounded bg-gray-200 px-1 text-[10px] text-gray-400">⌘K</kbd>
		</div>

		<!-- Nav filters -->
		{#each navFilters as item}
			<button
				class="pm-subnav-item"
				class:pm-subnav-item-active={item.id === activeNavItem}
			>
				<Icon icon={faCircle} class="text-[8px] shrink-0" />
				<LocalText slug={item.slug} scope="pm" />
			</button>
		{/each}

		<!-- Pinned section -->
		{#if pinnedWorkspaces.length > 0}
			<div class="pm-subnav-section-label">
				<LocalText slug="pm_subnav_pinned_label" scope="pm" />
			</div>
			{#each pinnedWorkspaces as ws}
				<button class="pm-subnav-item">
					<Icon icon={faPlus} class="text-[10px] shrink-0 opacity-50" />
					<LocalText slug="pm_workspace_name" scope="pm" contentId={ws.id} />
				</button>
			{/each}
		{/if}
	</div>

	<div class="pm-subnav-footer">
		<button class="btn btn-primary btn-sm w-full justify-center">
			<LocalText slug="pm_btn_new_workspace" scope="pm" />
		</button>
	</div>
</aside>
