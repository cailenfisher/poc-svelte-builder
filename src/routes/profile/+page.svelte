<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types.js';
	import AvatarPlaceholder from '$lib/components/universal/User/Account/Auth/AvatarPlaceholder.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}
	let { data, form }: Props = $props();
	let { user } = $derived(data);

	const avatarUrl = $derived(user?.user_metadata?.avatar_url ?? null);
	const displayName = $derived(user?.user_metadata?.full_name ?? '');
	const joinedDate = $derived(
		user?.created_at
			? new Date(user.created_at).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			: null
	);

	let saving = $state(false);
	let signingOut = $state(false);

	const handleUpdate: SubmitFunction = () => {
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		signingOut = true;
		return async ({ update }) => {
			await update();
		};
	};
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 px-4 py-10">
	<div class="mx-auto max-w-2xl space-y-6">

		<!-- Profile header card -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<div class="flex items-center gap-5">
				{#if avatarUrl}
					<img
						src={avatarUrl}
						alt="Profile avatar"
						class="h-20 w-20 rounded-full object-cover ring-2 ring-gray-100"
					/>
				{:else}
					<div class="h-20 w-20 rounded-full bg-gray-100 p-3">
						<AvatarPlaceholder />
					</div>
				{/if}
				<div>
					{#if displayName}
						<h1 class="text-xl font-bold text-gray-900">{displayName}</h1>
					{/if}
					<p class="text-sm text-gray-500">{user?.email}</p>
					{#if joinedDate}
						<span class="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
							Member since {joinedDate}
						</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Personal information card -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Personal Information</h2>

			{#if form?.message !== undefined}
				<div
					class="mb-4 rounded-lg p-3 text-sm {form.success
						? 'bg-green-50 text-green-800'
						: 'bg-red-50 text-red-800'}"
				>
					{form.message}
				</div>
			{/if}

			<form method="POST" action="?/updateProfile" use:enhance={handleUpdate} class="space-y-4">
				<div>
					<label for="displayName" class="mb-2 block text-sm font-medium text-gray-700">
						Display name
					</label>
					<input
						id="displayName"
						name="displayName"
						type="text"
						placeholder="Your name"
						value={form?.errors ? (form as Record<string, unknown>).displayName ?? displayName : displayName}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					/>
					{#if form?.errors?.displayName}
						<p class="mt-1.5 text-sm text-red-600">{form.errors.displayName}</p>
					{/if}
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-gray-700">Email address</label>
					<input
						type="email"
						value={user?.email ?? ''}
						disabled
						class="block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 p-2.5 text-sm text-gray-500"
					/>
					<p class="mt-1 text-xs text-gray-400">Email cannot be changed here.</p>
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						disabled={saving}
						class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{saving ? 'Saving…' : 'Save changes'}
					</button>
				</div>
			</form>
		</div>

		<!-- Danger zone -->
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
			<h2 class="mb-1 text-lg font-semibold text-gray-900">Account</h2>
			<p class="mb-4 text-sm text-gray-500">Sign out of your account on this device.</p>
			<form method="POST" action="?/signOut" use:enhance={handleSignOut}>
				<button
					type="submit"
					disabled={signingOut}
					class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{signingOut ? 'Signing out…' : 'Sign out'}
				</button>
			</form>
		</div>

	</div>
</div>
