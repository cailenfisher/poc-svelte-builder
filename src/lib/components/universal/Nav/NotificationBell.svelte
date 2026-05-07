<script lang="ts">
	import type { Notification } from '$lib/types/notification';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faBell, faXmark } from '@fortawesome/free-solid-svg-icons';
	import LocalText from '$lib/localization/LocalText.svelte';

	let { notifications = [] }: { notifications: Notification[] } = $props();

	let open = $state(false);
	let items = $state<Notification[]>([]);

	$effect(() => {
		items = [...notifications];
	});

	const unreadCount = $derived(items.filter((n) => !n.is_read).length);

	function timeAgo(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		return `${Math.floor(hours / 24)}d ago`;
	}

	function markRead(id: number) {
		items = items.map((n) => (n.id === id ? { ...n, is_read: true } : n));
		fetch('/api/notifications', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		}).catch(() => {});
	}

	function markAllRead() {
		items = items.map((n) => ({ ...n, is_read: true }));
		fetch('/api/notifications', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ all: true })
		}).catch(() => {});
	}

	function dismiss(id: number) {
		items = items.filter((n) => n.id !== id);
		fetch('/api/notifications', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		}).catch(() => {});
	}

	function clickOutside(node: HTMLElement) {
		function handle(e: MouseEvent) {
			if (!node.contains(e.target as Node)) open = false;
		}
		document.addEventListener('click', handle, true);
		return {
			destroy() {
				document.removeEventListener('click', handle, true);
			}
		};
	}
</script>

<div class="relative" use:clickOutside>
	<button
		type="button"
		class="notif-bell-btn"
		onclick={() => (open = !open)}
		aria-label="Notifications"
	>
		<Icon icon={faBell} />
		{#if unreadCount > 0}
			<span class="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
		{/if}
	</button>

	{#if open}
		<div class="notif-dropdown">
			<div class="notif-header">
				<span class="text-sm font-semibold text-gray-900"
					><LocalText slug="notification_count" values={{ count: unreadCount }} /></span
				>
				{#if unreadCount > 0}
					<button type="button" class="text-xs text-blue-600 hover:underline" onclick={markAllRead}>
						<LocalText slug="notification_clear_all" />
					</button>
				{/if}
			</div>

			{#if items.length === 0}
				<p class="notif-empty"><LocalText slug="notification_empty" /></p>
			{:else}
				<ul class="notif-list">
					{#each items as item (item.id)}
						<li class="notif-item" class:notif-item-unread={!item.is_read}>
							<button
								type="button"
								class="flex flex-1 items-start gap-3 text-left"
								onclick={() => {
									if (!item.is_read) markRead(item.id);
								}}
							>
								<span class="notif-dot notif-dot-{item.type}"></span>
								<div class="min-w-0 flex-1">
									<p class="text-sm leading-snug text-gray-800" class:font-medium={!item.is_read}>
										{item.message}
									</p>
									<p class="mt-0.5 text-xs text-gray-400">{timeAgo(item.created_at)}</p>
								</div>
							</button>
							<button
								type="button"
								class="mt-0.5 ml-1 shrink-0 p-0.5 text-gray-300 hover:text-gray-500"
								onclick={() => dismiss(item.id)}
								aria-label="Dismiss"
							>
								<Icon icon={faXmark} class="h-3 w-3" />
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
