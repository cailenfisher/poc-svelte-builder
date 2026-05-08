<script lang="ts">
	const demos = [
		{
			href: '/demo/social',
			label: 'Social',
			title: 'Social Media',
			description:
				'Post composer, feed with likes and comments, follow suggestions, and a user profile sidebar.',
			iconBg: 'bg-violet-50',
			iconText: 'text-violet-600',
			icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
		},
		{
			href: '/demo/commerce',
			label: 'Commerce',
			title: 'E-Commerce Store',
			description:
				'Featured products, category filtering, product detail modals, and a cart-ready storefront.',
			iconBg: 'bg-emerald-50',
			iconText: 'text-emerald-600',
			icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
		},
		{
			href: '/demo/commerce/admin',
			label: 'Admin',
			title: 'Commerce Admin',
			description:
				'Product management dashboard with stats cards, sortable data table, and full CRUD modals.',
			iconBg: 'bg-amber-50',
			iconText: 'text-amber-600',
			icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
		},
		{
			href: '/demo/logistic',
			label: 'Project Manager',
			title: 'Project Manager',
			description:
				'Kanban board with drag-and-drop tasks, icon rail navigation, inspector panel, and team avatars.',
			iconBg: 'bg-blue-50',
			iconText: 'text-blue-600',
			icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
		}
	];
</script>

<section class="border-b border-gray-200 bg-gray-50 px-6 py-12">
	<div class="mx-auto max-w-5xl">
		<div class="mb-8">
			<h2 class="mb-1.5 text-xl font-bold text-gray-900">Component Demos</h2>
			<p class="text-sm text-gray-500">
				Live mockups showcasing the UI patterns and component library included in SvelteBuilder.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each demos as demo}
				<a
					href={demo.href}
					class="flex flex-col gap-2 rounded-sm border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
				>
					<div class="mb-1 flex items-center justify-between">
						<div class="flex size-9 items-center justify-center rounded-sm {demo.iconBg} {demo.iconText}">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d={demo.icon} />
							</svg>
						</div>
						<span class="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
							{demo.label}
						</span>
					</div>
					<h3 class="text-sm font-semibold text-gray-900">{demo.title}</h3>
					<p class="grow text-xs leading-relaxed text-gray-500">{demo.description}</p>
					<span class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
						View demo
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="size-3.5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
						</svg>
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>
