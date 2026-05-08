<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';

	type Workspace = {
		id: number;
		initials: string;
		avatarBg: string;
		slug: string;
		env: string;
		plan: string;
		seatsUsed: number;
		seatsTotal: number;
		region: string;
		owner: string;
		sso: string;
	};

	let {
		workspace,
		onclose,
	}: {
		workspace: Workspace;
		onclose?: () => void;
	} = $props();

	let activeTab = $state<'overview' | 'activity' | 'members'>('overview');

	const tabs: { id: 'overview' | 'activity' | 'members'; slug: string }[] = [
		{ id: 'overview', slug: 'pm_inspector_overview' },
		{ id: 'activity', slug: 'pm_inspector_activity' },
		{ id: 'members', slug: 'pm_inspector_members' },
	];

	const infoRows: { keySlug: string; value: string }[] = $derived([
		{ keySlug: 'pm_inspector_plan', value: workspace.plan },
		{ keySlug: 'pm_inspector_seats', value: `${workspace.seatsUsed} / ${workspace.seatsTotal}` },
		{ keySlug: 'pm_inspector_region', value: workspace.region },
		{ keySlug: 'pm_inspector_owner', value: workspace.owner },
		{ keySlug: 'pm_inspector_sso', value: workspace.sso },
	]);
</script>

<aside class="pm-inspector">
	<div class="pm-inspector-header">
		<span class="pm-inspector-title">
			<LocalText slug="pm_inspector_title" scope="pm" />
		</span>
		<button class="pm-icon-btn h-6 w-6 rounded text-gray-400" onclick={onclose} title="Close">
			<Icon icon={faXmark} />
		</button>
	</div>

	<div class="pm-inspector-body">
		<!-- Workspace identity card -->
		<div class="pm-inspector-ws-card">
			<div class="pm-inspector-ws-avatar {workspace.avatarBg}">
				{workspace.initials}
			</div>
			<div>
				<div class="pm-inspector-ws-name">
					<LocalText slug="pm_workspace_name" scope="pm" contentId={workspace.id} />
				</div>
				<div class="pm-inspector-ws-meta">{workspace.slug} · {workspace.env}</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="pm-inspector-tabs">
			{#each tabs as tab}
				<button
					class="pm-inspector-tab"
					class:pm-inspector-tab-active={activeTab === tab.id}
					class:pm-inspector-tab-inactive={activeTab !== tab.id}
					onclick={() => (activeTab = tab.id)}
				>
					<LocalText slug={tab.slug} scope="pm" />
				</button>
			{/each}
		</div>

		{#if activeTab === 'overview'}
			<!-- Info rows -->
			<div class="py-1">
				{#each infoRows as row}
					<div class="pm-inspector-row">
						<span class="pm-inspector-key">
							<LocalText slug={row.keySlug} scope="pm" />
						</span>
						<span class="pm-inspector-val">{row.value}</span>
					</div>
				{/each}
			</div>

			<!-- Dashed divider -->
			<div class="mx-4 my-2 border-t border-dashed border-gray-200"></div>

			<!-- Recent activity -->
			<div class="pm-inspector-section">
				<div class="pm-inspector-section-title">
					<LocalText slug="pm_inspector_recent_activity" scope="pm" />
				</div>
				<div class="space-y-2">
					<div class="h-2 w-3/4 rounded-full bg-gray-100"></div>
					<div class="h-2 w-full rounded-full bg-gray-100"></div>
					<div class="h-2 w-1/2 rounded-full bg-gray-100"></div>
				</div>
			</div>
		{:else if activeTab === 'activity'}
			<div class="pm-inspector-section text-xs text-gray-400">No recent activity.</div>
		{:else}
			<div class="pm-inspector-section text-xs text-gray-400">No members to display.</div>
		{/if}
	</div>

	<div class="pm-inspector-footer">
		<button class="btn btn-secondary btn-sm flex-1 justify-center">
			<LocalText slug="pm_btn_suspend" scope="pm" />
		</button>
		<button class="btn btn-primary btn-sm flex-1 justify-center">
			<LocalText slug="pm_btn_open" scope="pm" />
		</button>
	</div>
</aside>
