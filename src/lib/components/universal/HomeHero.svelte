<script lang="ts">
	const goals = [
		{
			icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Enterprise-ready defaults',
			body: 'Semantic markup, accessibility, and structured error handling baked in from the first commit.'
		},
		{
			icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
			title: 'Deployable on day one',
			body: '.env-driven configuration means minimal setup to get a correctly customized app running on Vercel or similar.'
		},
		{
			icon: 'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802',
			title: 'Localization from the ground up',
			body: 'Multilingual content is a core concern. One component, one admin UI, one mental model for UI strings and database-backed content alike.'
		},
		{
			icon: 'M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5',
			title: 'Clear upgrade paths',
			body: 'Start with batteries-included services like Supabase, graduate to provider-agnostic abstractions without rewriting your app.'
		},
		{
			icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
			title: 'Extractable libraries',
			body: 'UI components and the i18n toolkit are designed to eventually ship as standalone NPM packages.'
		}
	];
</script>

<section class="border-b border-gray-200 bg-linear-to-br from-blue-50 via-white to-indigo-50 px-6 py-14">
	<div class="mx-auto max-w-5xl">
		<div class="mb-10 max-w-2xl">
			<div class="mb-3 inline-block rounded-full border border-blue-200 bg-blue-100 px-3 py-0.5 text-xs font-semibold tracking-wide text-blue-700 uppercase">
				Pre-release POC
			</div>
			<h1 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
				SvelteBuilder
			</h1>
			<p class="text-lg leading-relaxed text-gray-600">
				An opinionated starter template and toolkit for SvelteKit projects that need to be
				production-ready from day one — first-class localization, clean UI components, and strong
				patterns for routing, data access, auth, and error handling built in.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each goals as goal}
				<div class="flex gap-3 rounded-sm border border-gray-200 bg-white p-4 shadow-xs">
					<div class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d={goal.icon} />
						</svg>
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold text-gray-900">{goal.title}</p>
						<p class="text-xs leading-relaxed text-gray-500">{goal.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
