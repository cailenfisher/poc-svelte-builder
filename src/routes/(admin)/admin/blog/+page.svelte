<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';
	const dict = getDictionary();

	type Post = {
		id: number;
		slug: string;
		is_published: boolean;
		published_at: string | null;
		created_at: string;
	};

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { posts } = $derived(data);

	let creating = $state(false);
</script>

<svelte:head>
	<title>{dict.localText('page_title_admin_blog')}</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="page-title">Blog posts</h1>
		<p class="page-subtitle mt-1">Create and manage blog posts.</p>
	</div>

	{#if form?.errors?.general}
		<Alert variant="error">{form.errors.general}</Alert>
	{/if}

	<Card>
		<h2 class="card-title mb-4">Create post</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => {
					await update();
					creating = false;
				};
			}}
			class="flex items-end gap-3"
		>
			<div class="flex-1">
				<label for="slug" class="field-label-xs mb-1">URL Slug</label>
				<input
					id="slug"
					name="slug"
					type="text"
					placeholder="my-post-slug"
					required
					class="field-control font-mono"
				/>
			</div>
			<Button type="submit" variant="primary" loading={creating}>Create</Button>
		</form>
	</Card>

	<div class="data-table-wrapper">
		<table class="data-table">
			<thead class="data-table-head">
				<tr>
					<th class="data-table-th">Slug</th>
					<th class="data-table-th">Published</th>
					<th class="data-table-th">Published at</th>
					<th class="data-table-th">Actions</th>
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#if (posts as Post[]).length === 0}
					<tr>
						<td colspan="4" class="data-table-empty">No posts yet.</td>
					</tr>
				{:else}
					{#each posts as unknown as Post[] as post}
						<tr class="data-table-row">
							<td class="data-table-td font-mono text-xs text-gray-700">{post.slug}</td>
							<td class="data-table-td">
								{#if post.is_published}
									<span class="badge badge-green">Published</span>
								{:else}
									<span class="badge badge-gray">Draft</span>
								{/if}
							</td>
							<td class="data-table-td text-gray-500">
								{post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
							</td>
							<td class="data-table-td">
								<div class="flex items-center gap-3">
									<a href="/admin/blog/{post.id}" class="link-action">Edit</a>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={post.id} />
										<button
											type="submit"
											class="link-action-danger"
											onclick={(e) => {
												if (!confirm(`Delete post "${post.slug}"?`)) e.preventDefault();
											}}
										>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
