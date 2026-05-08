<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import PmTaskCard from './PmTaskCard.svelte';
	import { faEllipsis, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { localText } from '$lib/localization/dictionary.svelte';

	type Member = { id: string; initials: string; bg: string; text: string };
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string; title?: string };
	type Column = { id: string; titleSlug: string; tasks: Task[] };

	let {
		column,
		memberMap,
		selectedTaskId,
		onaddtask,
		ondeletetask,
		onselecttask,
		onmovetask,
	}: {
		column: Column;
		memberMap: Map<string, Member>;
		selectedTaskId: number | null;
		onaddtask: (columnId: string, title: string) => void;
		ondeletetask: (taskId: number) => void;
		onselecttask: (taskId: number) => void;
		onmovetask: (taskId: number, fromColumnId: string, toColumnId: string) => void;
	} = $props();

	let isAdding = $state(false);
	let newTitle = $state('');
	let isDragOver = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	$effect(() => {
		if (isAdding) inputEl?.focus();
	});

	function saveTask() {
		const title = newTitle.trim();
		if (title) onaddtask(column.id, title);
		newTitle = '';
		isAdding = false;
	}

	function cancelAdd() {
		newTitle = '';
		isAdding = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		isDragOver = true;
	}

	function handleDragLeave(e: DragEvent) {
		// Only clear if leaving the column entirely (not just moving between child elements)
		if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
			isDragOver = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		const raw = e.dataTransfer?.getData('application/json');
		if (!raw) return;
		try {
			const { taskId, fromColumnId } = JSON.parse(raw) as { taskId: number; fromColumnId: string };
			onmovetask(taskId, fromColumnId, column.id);
		} catch {
			// malformed drag data — ignore
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<div
	class="pm-column"
	class:pm-column-drag-over={isDragOver}
	role="group"
	onclick={(e) => e.stopPropagation()}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<div class="pm-column-header">
		<div class="flex items-center">
			<span class="pm-column-title">
				<LocalText slug={column.titleSlug} scope="pm" />
			</span>
			<span class="pm-column-count">{column.tasks.length}</span>
		</div>
		<button class="pm-icon-btn h-6 w-6 rounded text-gray-400">
			<Icon icon={faEllipsis} />
		</button>
	</div>

	<div class="pm-column-body">
		{#each column.tasks as task (task.id)}
			<PmTaskCard
				{task}
				{memberMap}
				columnId={column.id}
				selected={selectedTaskId === task.id}
				onselect={onselecttask}
				ondelete={ondeletetask}
			/>
		{/each}

		{#if isAdding}
			<div class="pm-add-task-form">
				<input
					bind:this={inputEl}
					bind:value={newTitle}
					class="pm-add-task-input"
					placeholder={localText('pm_add_task_placeholder', undefined, 'pm')}
					onkeydown={(e) => {
						if (e.key === 'Enter') saveTask();
						if (e.key === 'Escape') cancelAdd();
					}}
				/>
				<div class="mt-1.5 flex gap-1">
					<button class="btn btn-primary btn-sm flex-1 justify-center" onclick={saveTask}>
						<LocalText slug="pm_add_task_save" scope="pm" />
					</button>
					<button class="pm-icon-btn h-7 w-7 shrink-0 rounded" onclick={cancelAdd}>
						<Icon icon={faXmark} />
					</button>
				</div>
			</div>
		{/if}
	</div>

	<button class="pm-column-add" onclick={() => (isAdding = true)}>
		<Icon icon={faPlus} class="text-[10px]" />
		<LocalText slug="pm_btn_add_card" scope="pm" />
	</button>
</div>
