<script lang="ts">
	import LocalText from '$lib/localization/LocalText.svelte';

	type Member = { id: string; initials: string; bg: string; text: string };
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string };

	let {
		task,
		memberMap,
	}: {
		task: Task;
		memberMap: Map<string, Member>;
	} = $props();

	const assignee = $derived(memberMap.get(task.assigneeId));
</script>

<div class="pm-task-card">
	<p class="pm-task-title">
		<LocalText slug="pm_task_title" scope="pm" contentId={task.id} />
	</p>
	<div class="pm-task-footer">
		<div class="pm-task-labels">
			<span class="pm-label">{task.labelCode}</span>
			{#if task.priority}
				<span class="pm-priority">{task.priority}</span>
			{/if}
		</div>
		{#if assignee}
			<div class="pm-avatar-sm {assignee.bg} {assignee.text}" title={assignee.id}>
				{assignee.initials}
			</div>
		{/if}
	</div>
</div>
