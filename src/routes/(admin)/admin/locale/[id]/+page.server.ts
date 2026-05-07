import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const id = Number(params.id);

	const { data: locale, error: err } = await supabase
		.from('locale')
		.select('id, code, name, native_name, dir')
		.eq('id', id)
		.single();

	if (err || !locale) {
		error(404, 'Locale not found.');
	}

	return { locale };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase }, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const code = (formData.get('code') as string)?.trim();
		const name = (formData.get('name') as string)?.trim();
		const native_name = (formData.get('native_name') as string)?.trim();
		const dir = (formData.get('dir') as string) || null;

		if (!code || !name || !native_name) {
			return fail(400, { errors: { general: 'Code, name, and native name are required.' } });
		}

		const { error: err } = await supabase
			.from('locale')
			.update({ code, name, native_name, dir: dir || null })
			.eq('id', id);

		if (err) {
			console.error('admin/locale/[id] update - error updating locale', err);
			return fail(500, { errors: { general: 'Failed to update locale. Please try again.' } });
		}

		return { success: true, message: 'Locale updated.' };
	},

	delete: async ({ locals: { supabase }, params }) => {
		const id = Number(params.id);

		const { error: err } = await supabase.from('locale').delete().eq('id', id);

		if (err) {
			console.error('admin/locale/[id] delete - error deleting locale', err);
			return fail(500, { errors: { general: 'Failed to delete locale.' } });
		}

		redirect(303, '/admin/locale');
	},
};
