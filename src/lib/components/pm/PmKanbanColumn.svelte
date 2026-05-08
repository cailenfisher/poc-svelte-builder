<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import PmTaskCard from './PmTaskCard.svelte';
	import { faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons';

	type Member = { id: string; initials: string; bg: string; text: string };
	type Task = { id: number; labelCode: string; priority?: 'P1'; assigneeId: string };
	type Column = { id: string; titleSlug: string; tasks: Task[] };

	let {
		column,
		memberMap,
	}: {
		column: Column;
		memberMap: Map<string, Member>;
	} = $props();
</script>

<div class="pm-column">
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
			<PmTaskCard {task} {memberMap} />
		{/each}
	</div>

	<button class="pm-column-add">
		<Icon icon={faPlus} class="text-[10px]" />
		<LocalText slug="pm_btn_add_card" scope="pm" />
	</button>
</div>
