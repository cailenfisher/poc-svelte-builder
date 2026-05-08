<script lang="ts">
	import LocalText from '$lib/localization/LocalText.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';

	type Member = { id: string; initials: string; bg: string; text: string };
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string; title?: string };

	let {
		task,
		memberMap,
		columnId,
		selected = false,
		onselect,
		ondelete,
	}: {
		task: Task;
		memberMap: Map<string, Member>;
		columnId: string;
		selected?: boolean;
		onselect?: (taskId: number) => void;
		ondelete?: (taskId: number) => void;
	} = $props();

	const assignee = $derived(memberMap.get(task.assigneeId));
	let dragging = $state(false);
</script>

<!-- Stop propagation so clicks don't bubble to the kanban deselect handler -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="pm-task-card"
	class:pm-task-card-selected={selected}
	class:pm-task-card-dragging={dragging}
	role="button"
	tabindex="0"
	draggable="true"
	onclick={(e) => { e.stopPropagation(); onselect?.(task.id); }}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onselect?.(task.id); } }}
	ondragstart={(e) => {
		dragging = true;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, fromColumnId: columnId }));
		}
	}}
	ondragend={() => { dragging = false; }}
>
	<p class="pm-task-title">
		{#if task.title}
			{task.title}
		{:else}
			<LocalText slug="pm_task_title" scope="pm" contentId={task.id} />
		{/if}
	</p>
	<div class="pm-task-footer">
		<div class="pm-task-labels">
			<span class="pm-label">{task.labelCode}</span>
			{#if task.priority}
				<span class="pm-priority">{task.priority}</span>
			{/if}
		</div>
		<div class="flex items-center">
			{#if assignee}
				<div class="pm-avatar-sm {assignee.bg} {assignee.text}" title={assignee.id}>
					{assignee.initials}
				</div>
			{/if}
			<button
				class="pm-task-delete-btn"
				onclick={(e) => { e.stopPropagation(); ondelete?.(task.id); }}
				title="Delete"
				tabindex="-1"
			>
				<Icon icon={faXmark} />
			</button>
		</div>
	</div>
</div>
