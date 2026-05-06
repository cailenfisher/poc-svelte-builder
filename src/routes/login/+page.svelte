<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types.js';

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
			<a href="/" class="text-2xl font-bold text-gray-900">SvelteBuilder</a>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-md sm:p-8">
			<h1 class="mb-1 text-xl font-bold text-gray-900">Sign in to your account</h1>
			<p class="mb-5 text-sm text-gray-500">Use magic link or continue with Google</p>

			<a
				href="/login/google"
				class="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 focus:outline-none"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				Continue with Google
			</a>

			<div class="mb-5 flex items-center">
				<div class="h-px flex-1 bg-gray-200"></div>
				<span class="px-3 text-sm text-gray-400">or use magic link</span>
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
					<label for="email" class="mb-2 block text-sm font-medium text-gray-900">
						Email address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="name@company.com"
						value={form?.email ?? ''}
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					/>
					{#if form?.errors?.email}
						<p class="mt-1.5 text-sm text-red-600">{form.errors.email}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? 'Sending…' : 'Send magic link'}
				</button>
			</form>
		</div>
	</div>
</div>
