<script lang="ts">
	import PmIconRail from '$lib/components/pm/PmIconRail.svelte';
	import PmSubNav from '$lib/components/pm/PmSubNav.svelte';
	import PmKanbanColumn from '$lib/components/pm/PmKanbanColumn.svelte';
	import PmInspectorPanel from '$lib/components/pm/PmInspectorPanel.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { faMagnifyingGlass, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

	// ── Types ─────────────────────────────────────────────────────────────────
	type Member = { id: string; initials: string; bg: string; text: string };
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string; title?: string };
	type Column = { id: string; titleSlug: string; tasks: Task[] };
	type NavWorkspace = { id: number; pinned: boolean };
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
	type SelectedEntry = { task: Task; column: Column } | null;

	// ── Mock Data ─────────────────────────────────────────────────────────────
	const members: Member[] = [
		{ id: 'A', initials: 'A', bg: 'bg-blue-500', text: 'text-white' },
		{ id: 'S', initials: 'S', bg: 'bg-orange-400', text: 'text-white' },
		{ id: 'J', initials: 'J', bg: 'bg-gray-400', text: 'text-white' },
		{ id: 'M', initials: 'M', bg: 'bg-amber-200', text: 'text-amber-800' },
	];

	const memberMap = new Map(members.map((m) => [m.id, m]));

	let columns = $state<Column[]>([
		{
			id: 'backlog',
			titleSlug: 'pm_col_backlog',
			tasks: [
				{ id: 1, labelCode: 'INF-100', priority: 'P1', assigneeId: 'A' },
				{ id: 2, labelCode: 'BIL-101', assigneeId: 'S' },
				{ id: 3, labelCode: 'SEC-102', assigneeId: 'J' },
				{ id: 4, labelCode: 'OPS-103', priority: 'P1', assigneeId: 'M' },
			],
		},
		{
			id: 'in_progress',
			titleSlug: 'pm_col_in_progress',
			tasks: [
				{ id: 5, labelCode: 'BIL-100', assigneeId: 'S' },
				{ id: 6, labelCode: 'SEC-101', assigneeId: 'J' },
				{ id: 7, labelCode: 'OPS-102', priority: 'P1', assigneeId: 'M' },
			],
		},
		{
			id: 'review',
			titleSlug: 'pm_col_review',
			tasks: [
				{ id: 8, labelCode: 'SEC-100', assigneeId: 'J' },
				{ id: 9, labelCode: 'OPS-101', priority: 'P1', assigneeId: 'M' },
			],
		},
		{
			id: 'done',
			titleSlug: 'pm_col_done',
			tasks: [
				{ id: 10, labelCode: 'OPS-100', priority: 'P1', assigneeId: 'M' },
				{ id: 11, labelCode: 'INF-101', assigneeId: 'A' },
				{ id: 12, labelCode: 'BIL-102', assigneeId: 'S' },
			],
		},
	]);

	const navWorkspaces: NavWorkspace[] = [
		{ id: 1, pinned: true },
		{ id: 2, pinned: true },
		{ id: 3, pinned: true },
	];

	const activeWorkspace: Workspace = {
		id: 1,
		initials: 'AC',
		avatarBg: 'bg-blue-600',
		slug: 'ws_8f2a',
		env: 'prod',
		plan: 'Enterprise',
		seatsUsed: 248,
		seatsTotal: 300,
		region: 'us-east-1',
		owner: 'admin@acme.co',
		sso: 'Okta · enforced',
	};

	// ── Board state ────────────────────────────────────────────────────────────
	const boardSprint = 14;
	const totalTasks = $derived(columns.reduce((sum, col) => sum + col.tasks.length, 0));

	let inspectorOpen = $state(true);
	let selectedTaskId = $state<number | null>(null);
	let nextTaskId = 100;

	const selectedEntry = $derived.by<SelectedEntry>(() => {
		if (selectedTaskId === null) return null;
		for (const col of columns) {
			const task = col.tasks.find((t) => t.id === selectedTaskId);
			if (task) return { task, column: col };
		}
		return null;
	});

	// Auto-open inspector whenever a task is selected.
	$effect(() => {
		if (selectedTaskId !== null) inspectorOpen = true;
	});

	// ── Actions ────────────────────────────────────────────────────────────────
	function addTask(columnId: string, title: string): number {
		const col = columns.find((c) => c.id === columnId);
		if (!col) return -1;
		const id = nextTaskId++;
		col.tasks.push({ id, labelCode: `NEW-${id}`, assigneeId: members[0].id, title });
		return id;
	}

	function deleteTask(taskId: number) {
		for (const col of columns) {
			const idx = col.tasks.findIndex((t) => t.id === taskId);
			if (idx !== -1) {
				col.tasks.splice(idx, 1);
				if (selectedTaskId === taskId) selectedTaskId = null;
				return;
			}
		}
	}

	function moveTask(taskId: number, fromColumnId: string, toColumnId: string) {
		if (fromColumnId === toColumnId) return;
		const fromCol = columns.find((c) => c.id === fromColumnId);
		const toCol = columns.find((c) => c.id === toColumnId);
		if (!fromCol || !toCol) return;
		const idx = fromCol.tasks.findIndex((t) => t.id === taskId);
		if (idx === -1) return;
		const [task] = fromCol.tasks.splice(idx, 1);
		toCol.tasks.push(task);
	}
</script>

<svelte:head>
	<title>Project Manager Demo</title>
</svelte:head>

<div class="pm-shell">
	<PmIconRail activeSection="board" />

	<PmSubNav {navWorkspaces} activeNavItem="all_workspaces" />

	<!-- Main content column -->
	<div class="flex min-w-0 flex-1 flex-col overflow-hidden">
		<!-- Breadcrumb / top bar -->
		<div class="pm-topbar">
			<div class="flex items-center gap-1 text-xs text-gray-500">
				<LocalText slug="pm_breadcrumb_workspaces" scope="pm" />
				<Icon icon={faChevronRight} class="text-[9px]" />
				<span class="font-medium text-gray-700">Operations board</span>
			</div>
			<div class="flex items-center gap-2">
				<div
					class="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-400"
				>
					<Icon icon={faMagnifyingGlass} class="text-[11px]" />
					<LocalText slug="pm_topbar_search" scope="pm" />
					<kbd class="ml-1 rounded bg-gray-200 px-1 text-[10px] text-gray-400">⌘K</kbd>
				</div>
			</div>
		</div>

		<!-- Board header -->
		<div class="pm-board-header">
			<div>
				<h1 class="pm-board-title">Operations board</h1>
				<p class="pm-board-meta">
					<LocalText slug="pm_board_items" scope="pm" values={{ count: totalTasks }} />
					·
					<LocalText slug="pm_board_owners" scope="pm" values={{ count: members.length }} />
					·
					<LocalText slug="pm_board_sprint" scope="pm" values={{ number: boardSprint }} />
				</p>
			</div>
			<div class="flex items-center gap-3">
				<div class="pm-member-avatars">
					{#each members as member}
						<div class="pm-member-avatar {member.bg} {member.text}" title={member.id}>
							{member.initials}
						</div>
					{/each}
				</div>
				<Button variant="secondary" size="sm">
					<LocalText slug="pm_btn_group_status" scope="pm" />
				</Button>
				<Button
					variant="primary"
					size="sm"
					onclick={() => {
						const id = addTask('backlog', 'New task');
						if (id > 0) selectedTaskId = id;
					}}
				>
					<Icon icon={faPlus} class="text-[11px]" />
					<LocalText slug="pm_btn_add_task" scope="pm" />
				</Button>
			</div>
		</div>

		<!-- Kanban board — clicking the empty background deselects -->
		<div class="pm-kanban" role="presentation" onclick={() => (selectedTaskId = null)}>
			{#each columns as column (column.id)}
				<PmKanbanColumn
					{column}
					{memberMap}
					{selectedTaskId}
					onaddtask={addTask}
					ondeletetask={deleteTask}
					onselecttask={(id) => (selectedTaskId = id)}
					onmovetask={moveTask}
				/>
			{/each}
		</div>
	</div>

	<!-- Inspector panel -->
	{#if inspectorOpen}
		<PmInspectorPanel
			workspace={activeWorkspace}
			{memberMap}
			{selectedEntry}
			ondeletetask={deleteTask}
			onclose={() => (inspectorOpen = false)}
		/>
	{/if}
</div>
