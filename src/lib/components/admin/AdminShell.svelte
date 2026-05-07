<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavLink from '$lib/components/ui/NavLink.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		faGauge,
		faLanguage,
		faFileLines,
		faArrowRightFromBracket,
	} from '@fortawesome/free-solid-svg-icons';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<aside class="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
		<div class="flex h-16 items-center border-b border-gray-200 px-5">
			<a href="/" class="text-base font-semibold text-gray-900 hover:text-blue-600">
				SvelteBuilder
			</a>
			<span class="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
				Admin
			</span>
		</div>

		<nav class="flex-1 space-y-1 overflow-y-auto p-3">
			<NavLink href="/admin" label="Dashboard" icon={faGauge} />
			<NavLink href="/admin/locale" label="Locales" icon={faLanguage} />
			<NavLink href="/admin/content" label="Content" icon={faFileLines} />
		</nav>

		<div class="border-t border-gray-200 p-3">
			<form method="POST" action="/profile?/signOut">
				<Button type="submit" variant="secondary" class="w-full justify-start gap-3">
					<span class="text-gray-500">
						<!-- inline icon to avoid import collision with Button's internal Icon -->
						<svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 512 512" fill="currentColor">
							<path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/>
						</svg>
					</span>
					Sign out
				</Button>
			</form>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-auto p-6">
		{@render children?.()}
	</main>
</div>
