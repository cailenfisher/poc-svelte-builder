import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();

	if (!session) {
		redirect(303, '/login');
	}

	return { user };
};

export const actions: Actions = {
	signOut: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, '/login');
	},

	updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) redirect(303, '/login');

		const formData = await request.formData();
		const displayName = (formData.get('displayName') as string)?.trim();

		if (!displayName) {
			return fail(400, { errors: { displayName: 'Display name cannot be empty' } });
		}

		const { error } = await supabase.auth.updateUser({
			data: { full_name: displayName }
		});

		if (error) {
			return fail(500, { success: false, message: 'Failed to update profile. Please try again.' });
		}

		return { success: true, message: 'Profile updated successfully.' };
	}
};
