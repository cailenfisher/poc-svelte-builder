import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const [localeRes, linkRes, translationRes] = await Promise.all([
		supabase.from('locale').select('id', { count: 'exact', head: true }),
		supabase.from('local_text_link').select('id', { count: 'exact', head: true }),
		supabase.from('local_text').select('id', { count: 'exact', head: true }),
	]);

	return {
		stats: {
			localeCount: localeRes.count ?? 0,
			linkCount: linkRes.count ?? 0,
			translationCount: translationRes.count ?? 0,
		},
	};
};

export const actions: Actions = {
	testNotification: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) return fail(401, { errors: { general: 'Not authenticated.' } });

		const formData = await request.formData();
		const message = (formData.get('message') as string)?.trim() || 'Test notification';
		const type = (formData.get('type') as string) || 'info';

		const { error } = await supabase
			.from('notification')
			.insert({ user_id: session.user.id, message, type });

		if (error) {
			console.error('admin dashboard testNotification - error inserting', error);
			return fail(500, { errors: { general: 'Failed to send notification.' } });
		}

		return { success: true, action: 'test' as const };
	}
};
