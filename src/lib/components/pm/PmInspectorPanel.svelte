<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';

	type Member = { id: string; initials: string; bg: string; text: string };
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string; title?: string };
	type Column = { id: string; titleSlug: string; tasks: Task[] };
	type SelectedEntry = { task: Task; column: Column } | null;
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
		memberMap,
		selectedEntry = null,
		ondeletetask,
		onclose,
	}: {
		workspace: Workspace;
		memberMap: Map<string, Member>;
		selectedEntry?: SelectedEntry;
		ondeletetask?: (taskId: number) => void;
		onclose?: () => void;
	} = $props();

	// ── Workspace mode ────────────────────────────────────────────────────────
	let activeTab = $state<'overview' | 'activity' | 'members'>('overview');

	const wsTabs: { id: 'overview' | 'activity' | 'members'; slug: string }[] = [
		{ id: 'overview', slug: 'pm_inspector_overview' },
		{ id: 'activity', slug: 'pm_inspector_activity' },
		{ id: 'members', slug: 'pm_inspector_members' },
	];

	const wsInfoRows: { keySlug: string; value: string }[] = $derived([
		{ keySlug: 'pm_inspector_plan', value: workspace.plan },
		{ keySlug: 'pm_inspector_seats', value: `${workspace.seatsUsed} / ${workspace.seatsTotal}` },
		{ keySlug: 'pm_inspector_region', value: workspace.region },
		{ keySlug: 'pm_inspector_owner', value: workspace.owner },
		{ keySlug: 'pm_inspector_sso', value: workspace.sso },
	]);

	// ── Task mode ─────────────────────────────────────────────────────────────
	let taskTab = $state<'details' | 'activity'>('details');

	const taskInfoRows = $derived.by(() => {
		if (!selectedEntry) return [];
		const assignee = memberMap.get(selectedEntry.task.assigneeId);
		return [
			{ keySlug: 'pm_inspector_task_label_key', value: selectedEntry.task.labelCode, assignee: null },
			{ keySlug: 'pm_inspector_task_priority_key', value: selectedEntry.task.priority ?? null, assignee: null },
			{ keySlug: 'pm_inspector_task_assignee_key', value: null, assignee: assignee ?? null },
		] as const;
	});
</script>

<aside class="pm-inspector">
	{#if selectedEntry}
		<!-- ── Task inspector ─────────────────────────────────────────────────── -->
		<div class="pm-inspector-header">
			<span class="pm-inspector-title">
				<LocalText slug="pm_inspector_task_heading" scope="pm" />
			</span>
			<button class="pm-icon-btn h-6 w-6 rounded text-gray-400" onclick={onclose} title="Close">
				<Icon icon={faXmark} />
			</button>
		</div>

		<div class="pm-inspector-body">
			<!-- Task identity -->
			<div class="flex items-start gap-2 border-b border-gray-100 px-4 py-3">
				<div class="mt-0.5 shrink-0">
					<span class="pm-label">{selectedEntry.task.labelCode}</span>
				</div>
				<p class="text-sm font-medium leading-snug text-gray-900">
					{#if selectedEntry.task.title}
						{selectedEntry.task.title}
					{:else}
						<LocalText slug="pm_task_title" scope="pm" contentId={selectedEntry.task.id} />
					{/if}
				</p>
			</div>

			<!-- Tabs -->
			<div class="pm-inspector-tabs">
				{#each (['details', 'activity'] as const) as tab}
					<button
						class="pm-inspector-tab"
						class:pm-inspector-tab-active={taskTab === tab}
						class:pm-inspector-tab-inactive={taskTab !== tab}
						onclick={() => (taskTab = tab)}
					>
						<LocalText slug="pm_inspector_task_{tab}_tab" scope="pm" />
					</button>
				{/each}
			</div>

			{#if taskTab === 'details'}
				<div class="py-1">
					<!-- Status row (derived from column) -->
					<div class="pm-inspector-row">
						<span class="pm-inspector-key">
							<LocalText slug="pm_inspector_task_status_key" scope="pm" />
						</span>
						<span class="pm-inspector-val">
							<LocalText slug={selectedEntry.column.titleSlug} scope="pm" />
						</span>
					</div>

					{#each taskInfoRows as row}
						<div class="pm-inspector-row">
							<span class="pm-inspector-key">
								<LocalText slug={row.keySlug} scope="pm" />
							</span>
							<span class="pm-inspector-val">
								{#if row.assignee}
									<span class="flex items-center gap-1.5">
										<span class="pm-avatar-sm {row.assignee.bg} {row.assignee.text}">
											{row.assignee.initials}
										</span>
										{row.assignee.id}
									</span>
								{:else if row.value}
									{row.value}
								{:else}
									<LocalText slug="pm_inspector_task_none" scope="pm" />
								{/if}
							</span>
						</div>
					{/each}
				</div>

				<div class="mx-4 my-2 border-t border-dashed border-gray-200"></div>

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
			{:else}
				<div class="pm-inspector-section text-xs text-gray-400">No recent activity.</div>
			{/if}
		</div>

		<div class="pm-inspector-footer">
			<button
				class="btn btn-danger btn-sm flex-1 justify-center"
				onclick={() => ondeletetask?.(selectedEntry.task.id)}
			>
				<LocalText slug="pm_btn_delete_task" scope="pm" />
			</button>
		</div>
	{:else}
		<!-- ── Workspace inspector ────────────────────────────────────────────── -->
		<div class="pm-inspector-header">
			<span class="pm-inspector-title">
				<LocalText slug="pm_inspector_title" scope="pm" />
			</span>
			<button class="pm-icon-btn h-6 w-6 rounded text-gray-400" onclick={onclose} title="Close">
				<Icon icon={faXmark} />
			</button>
		</div>

		<div class="pm-inspector-body">
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

			<div class="pm-inspector-tabs">
				{#each wsTabs as tab}
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
				<div class="py-1">
					{#each wsInfoRows as row}
						<div class="pm-inspector-row">
							<span class="pm-inspector-key">
								<LocalText slug={row.keySlug} scope="pm" />
							</span>
							<span class="pm-inspector-val">{row.value}</span>
						</div>
					{/each}
				</div>

				<div class="mx-4 my-2 border-t border-dashed border-gray-200"></div>

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
	{/if}
</aside>
