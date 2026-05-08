<script lang="ts">
	import { onMount } from 'svelte';
	import { mergeDictionary } from '$lib/localization/dictionary.svelte';
	import type { LocalText as LocalTextItem } from '$lib/localization/localization';
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
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string };
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

	// ── Mock Data ─────────────────────────────────────────────────────────────
	const members: Member[] = [
		{ id: 'A', initials: 'A', bg: 'bg-blue-500', text: 'text-white' },
		{ id: 'S', initials: 'S', bg: 'bg-orange-400', text: 'text-white' },
		{ id: 'J', initials: 'J', bg: 'bg-gray-400', text: 'text-white' },
		{ id: 'M', initials: 'M', bg: 'bg-amber-200', text: 'text-amber-800' },
	];

	const memberMap = new Map(members.map((m) => [m.id, m]));

	const columns: Column[] = [
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
	];

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

	const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
	const boardSprint = 14;

	let inspectorOpen = $state(true);

	// ── LocalText mock injection ───────────────────────────────────────────────
	// Injects demo content into the dictionary so LocalText components render
	// without requiring the INSERT SQL to be run first.
	// IDs use the 5000+ range to avoid collisions with real data.
	const EN_US: LocalTextItem['locale'] = {
		id: 99,
		code: 'en-US',
		name: 'English',
		native_name: 'English',
		dir: 'ltr',
	};

	function makeEntry(
		linkId: number,
		slug: string,
		content: string,
		scoped_content_id: number | null = null
	): LocalTextItem {
		return {
			id: linkId * 1000 + (scoped_content_id ?? 0),
			scoped_content_id,
			content,
			locale: EN_US,
			link: { id: linkId, slug, title: slug, scope: 'pm' },
		};
	}

	const pmContent: LocalTextItem[] = [
		// UI chrome
		makeEntry(5001, 'pm_section_workspaces', 'Workspaces'),
		makeEntry(5002, 'pm_filter_workspaces', 'Filter workspaces'),
		makeEntry(5003, 'pm_nav_all_workspaces', 'All workspaces'),
		makeEntry(5004, 'pm_nav_active', 'Active'),
		makeEntry(5005, 'pm_nav_suspended', 'Suspended'),
		makeEntry(5006, 'pm_nav_recently_created', 'Recently created'),
		makeEntry(5007, 'pm_nav_pinned_filter', 'Pinned'),
		makeEntry(5008, 'pm_nav_tags', 'Tags'),
		makeEntry(5009, 'pm_nav_saved_views', 'Saved views'),
		makeEntry(5010, 'pm_btn_new_workspace', '+ New workspace'),
		makeEntry(5011, 'pm_board_items', '{count} items'),
		makeEntry(5012, 'pm_board_owners', '{count} owners'),
		makeEntry(5013, 'pm_board_sprint', 'sprint {number}'),
		makeEntry(5014, 'pm_btn_group_status', 'Group status'),
		makeEntry(5015, 'pm_btn_add_task', '+ Task'),
		makeEntry(5016, 'pm_col_backlog', 'Backlog'),
		makeEntry(5017, 'pm_col_in_progress', 'In progress'),
		makeEntry(5018, 'pm_col_review', 'Review'),
		makeEntry(5019, 'pm_col_done', 'Done'),
		makeEntry(5020, 'pm_btn_add_card', '+ Add card'),
		makeEntry(5021, 'pm_inspector_title', 'Inspector · Workspace'),
		makeEntry(5022, 'pm_inspector_overview', 'Overview'),
		makeEntry(5023, 'pm_inspector_activity', 'Activity'),
		makeEntry(5024, 'pm_inspector_members', 'Members'),
		makeEntry(5025, 'pm_inspector_plan', 'Plan'),
		makeEntry(5026, 'pm_inspector_seats', 'Seats'),
		makeEntry(5027, 'pm_inspector_region', 'Region'),
		makeEntry(5028, 'pm_inspector_owner', 'Owner'),
		makeEntry(5029, 'pm_inspector_sso', 'SSO'),
		makeEntry(5030, 'pm_inspector_recent_activity', 'Recent activity'),
		makeEntry(5031, 'pm_btn_suspend', 'Suspend'),
		makeEntry(5032, 'pm_btn_open', 'Open →'),
		makeEntry(5033, 'pm_topbar_search', 'Search'),
		makeEntry(5034, 'pm_subnav_pinned_label', 'PINNED'),
		makeEntry(5035, 'pm_breadcrumb_workspaces', 'Workspaces'),
		// Scoped task titles (all share link ID 5041)
		makeEntry(5041, 'pm_task_title', 'Rotate API keys', 1),
		makeEntry(5041, 'pm_task_title', 'Audit log retention', 2),
		makeEntry(5041, 'pm_task_title', 'SAML group sync', 3),
		makeEntry(5041, 'pm_task_title', 'Region us-west-3', 4),
		makeEntry(5041, 'pm_task_title', 'Migrate billing v2', 5),
		makeEntry(5041, 'pm_task_title', 'Onboard Initech', 6),
		makeEntry(5041, 'pm_task_title', 'SCIM patch', 7),
		makeEntry(5041, 'pm_task_title', 'Dark mode GA', 8),
		makeEntry(5041, 'pm_task_title', 'Pricing page', 9),
		makeEntry(5041, 'pm_task_title', 'SSO for Globex', 10),
		makeEntry(5041, 'pm_task_title', 'Q3 access review', 11),
		makeEntry(5041, 'pm_task_title', 'Webhook v3', 12),
		// Scoped workspace names (all share link ID 5042)
		makeEntry(5042, 'pm_workspace_name', 'Acme Corp', 1),
		makeEntry(5042, 'pm_workspace_name', 'Globex', 2),
		makeEntry(5042, 'pm_workspace_name', 'Initech', 3),
	];

	onMount(() => {
		mergeDictionary(pmContent);
	});
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
						<div
							class="pm-member-avatar {member.bg} {member.text}"
							title={member.id}
						>{member.initials}</div>
					{/each}
				</div>
				<Button variant="secondary" size="sm">
					<LocalText slug="pm_btn_group_status" scope="pm" />
				</Button>
				<Button variant="primary" size="sm">
					<Icon icon={faPlus} class="text-[11px]" />
					<LocalText slug="pm_btn_add_task" scope="pm" />
				</Button>
			</div>
		</div>

		<!-- Kanban board -->
		<div class="pm-kanban">
			{#each columns as column (column.id)}
				<PmKanbanColumn {column} {memberMap} />
			{/each}
		</div>
	</div>

	<!-- Inspector panel -->
	{#if inspectorOpen}
		<PmInspectorPanel
			workspace={activeWorkspace}
			onclose={() => (inspectorOpen = false)}
		/>
	{/if}
</div>
