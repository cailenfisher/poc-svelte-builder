import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: locales, error } = await supabase
		.from('locale')
		.select('id, code, name, native_name, dir')
		.order('name');

	if (error) {
		console.error('admin/locale load - error fetching locales', error);
	}

	return { locales: locales ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const code = (formData.get('code') as string)?.trim();
		const name = (formData.get('name') as string)?.trim();
		const native_name = (formData.get('native_name') as string)?.trim();
		const dir = (formData.get('dir') as string) || null;

		if (!code || !name || !native_name) {
			return fail(400, { errors: { general: 'Code, name, and native name are required.' } });
		}

		const { error } = await supabase
			.from('locale')
			.insert({ code, name, native_name, dir: dir || null });

		if (error) {
			console.error('admin/locale create - error inserting locale', error);
			if (error.code === '23505') {
				return fail(400, { errors: { general: `Locale with code "${code}" already exists.` } });
			}
			return fail(500, { errors: { general: 'Failed to create locale. Please try again.' } });
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { errors: { general: 'Invalid locale ID.' } });

		const { error } = await supabase.from('locale').delete().eq('id', id);

		if (error) {
			console.error('admin/locale delete - error deleting locale', error);
			return fail(500, { errors: { general: 'Failed to delete locale. Please try again.' } });
		}

		redirect(303, '/admin/locale');
	},
};
