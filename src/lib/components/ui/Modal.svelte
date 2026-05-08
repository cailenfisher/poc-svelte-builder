<script lang="ts">
	import type { Snippet } from 'svelte';
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import Icon from './Icon.svelte';

	let {
		open = false,
		title,
		size = 'md',
		onclose,
		header = undefined,
		footer = undefined,
		children,
	}: {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg';
		onclose?: () => void;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	} = $props();

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose?.();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
	>
		<div class="modal {size === 'lg' ? 'modal-lg' : size === 'sm' ? 'modal-sm' : ''}">
			<div class="modal-header">
				{#if header}
					{@render header()}
				{:else if title}
					<span class="modal-title">{title}</span>
				{/if}
				{#if onclose}
					<button type="button" class="modal-close" onclick={onclose} aria-label="Close">
						<Icon icon={faTimes} />
					</button>
				{/if}
			</div>
			<div class="modal-body">
				{@render children?.()}
			</div>
			{#if footer}
				<div class="modal-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
