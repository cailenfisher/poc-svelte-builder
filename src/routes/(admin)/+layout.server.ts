import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/login');
	}

	const { data: locales, error } = await supabase
		.from('locale')
		.select('id, code, name, native_name, dir')
		.order('name');

	if (error) {
		console.error('admin layout - error fetching locales', error);
	}

	return { locales: locales ?? [] };
};
