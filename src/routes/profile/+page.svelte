<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types.js';
	import AvatarPlaceholder from '$lib/components/universal/User/Account/Auth/AvatarPlaceholder.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { getDictionary } from '$lib/localization/context.svelte';

	const dict = getDictionary();

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
	<title>{dict.localText('page_title_profile')}</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">

	<!-- Profile header card -->
	<Card>
		<div class="flex items-center gap-5">
			{#if avatarUrl}
				<img src={avatarUrl} alt="Profile avatar" class="avatar h-20 w-20 ring-2 ring-gray-100" />
			{:else}
				<div class="h-20 w-20 rounded-full bg-gray-100 p-3">
					<AvatarPlaceholder />
				</div>
			{/if}
			<div>
				{#if displayName}
					<h1 class="page-title">{displayName}</h1>
				{/if}
				<p class="page-subtitle">{user?.email}</p>
				{#if joinedDate}
					<span class="badge badge-blue mt-1">
						<LocalText slug="profile_member_since" />{joinedDate}
					</span>
				{/if}
			</div>
		</div>
	</Card>

	<!-- Personal information card -->
	<Card>
		<h2 class="mb-4 section-title">
			<LocalText slug="profile_personal_info_heading" />
		</h2>

		{#if form?.message !== undefined}
			<div class="mb-4">
				<Alert variant={form.success ? 'success' : 'error'}>{form.message}</Alert>
			</div>
		{/if}

		<form method="POST" action="?/updateProfile" use:enhance={handleUpdate} class="space-y-4">
			<FormField error={form?.errors?.displayName}>
				{#snippet label()}
					<label for="displayName"><LocalText slug="profile_display_name_label" /></label>
				{/snippet}
				{#snippet input()}
					<input
						id="displayName"
						name="displayName"
						type="text"
						placeholder="Your name"
						value={form?.errors ? (form as Record<string, unknown>).displayName ?? displayName : displayName}
						class="field-control"
					/>
				{/snippet}
			</FormField>

			<FormField disabled hint={dict.localText('profile_email_hint')}>
				{#snippet label()}
					<label for="profile_email_display"><LocalText slug="common_email_label" /></label>
				{/snippet}
				{#snippet input()}
					<input
						id="profile_email_display"
						type="email"
						value={user?.email ?? ''}
						disabled
						class="field-control"
					/>
				{/snippet}
			</FormField>

			<div class="flex justify-end">
				<Button type="submit" variant="primary" loading={saving}>
					{#if saving}
						<LocalText slug="common_saving" />
					{:else}
						<LocalText slug="profile_save_button" />
					{/if}
				</Button>
			</div>
		</form>
	</Card>

	<!-- Account card -->
	<Card variant="outlined">
		<h2 class="mb-1 section-title">
			<LocalText slug="profile_account_heading" />
		</h2>
		<p class="mb-4 page-subtitle">
			<LocalText slug="profile_account_subtitle" />
		</p>
		<form method="POST" action="?/signOut" use:enhance={handleSignOut}>
			<Button type="submit" variant="secondary" loading={signingOut}>
				{#if signingOut}
					<LocalText slug="profile_signing_out_button" />
				{:else}
					<LocalText slug="profile_sign_out_button" />
				{/if}
			</Button>
		</form>
	</Card>

</div>
