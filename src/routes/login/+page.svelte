<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types.js';
	import LocalText from '$lib/localization/LocalText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faGoogle } from '@fortawesome/free-brands-svg-icons';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();
	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
	<div class="w-full max-w-md">
		<div class="mb-6 flex justify-center">
			<a href="/" class="text-2xl font-bold text-gray-900">
				<LocalText slug="nav_brand" />
			</a>
		</div>

		<Card padding="p-6 sm:p-8">
			<h1 class="mb-1 text-xl font-bold text-gray-900">
				<LocalText slug="login_heading" />
			</h1>
			<p class="mb-5 text-sm text-gray-500">
				<LocalText slug="login_subtitle" />
			</p>

			<Button href="/login/google" variant="secondary" class="mb-5 w-full">
				<Icon icon={faGoogle} />
				<LocalText slug="login_google_button" />
			</Button>

			<div class="mb-5 flex items-center">
				<div class="h-px flex-1 bg-gray-200"></div>
				<span class="px-3 text-sm text-gray-400">
					<LocalText slug="login_divider" />
				</span>
				<div class="h-px flex-1 bg-gray-200"></div>
			</div>

			<form method="POST" use:enhance={handleSubmit}>
				{#if form?.message !== undefined}
					<div
						class="mb-4 rounded-lg p-3 text-sm {form.success
							? 'bg-green-50 text-green-800'
							: 'bg-red-50 text-red-800'}"
					>
						{form.message}
					</div>
				{/if}

				<div class="mb-4">
					<FormField error={form?.errors?.email}>
						{#snippet label()}
							<label for="email"><LocalText slug="common_email_label" /></label>
						{/snippet}
						{#snippet input()}
							<input
								id="email"
								name="email"
								type="email"
								placeholder="name@company.com"
								value={form?.email ?? ''}
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
							/>
						{/snippet}
					</FormField>
				</div>

				<Button type="submit" variant="primary" {loading} class="w-full">
					{#if loading}
						<LocalText slug="login_sending" />
					{:else}
						<LocalText slug="login_send_button" />
					{/if}
				</Button>
			</form>
		</Card>
	</div>
</div>
