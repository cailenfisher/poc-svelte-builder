import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const id = Number(params.id);

	const { data, error: err } = await supabase
		.from('nav_item')
		.select('id, label, href, sort_order, is_published, requires_auth')
		.eq('id', id)
		.single();

	if (err || !data) {
		error(404, 'Nav item not found.');
	}

	return { navItem: data };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase }, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const label = (formData.get('label') as string)?.trim();
		const href = (formData.get('href') as string)?.trim();
		const sort_order = Number(formData.get('sort_order') ?? 0);
		const is_published = formData.get('is_published') === 'true';
		const requires_auth = formData.get('requires_auth') === 'true';

		if (!label || !href) {
			return fail(400, { errors: { general: 'Label and href are required.' } });
		}

		const { error: err } = await supabase
			.from('nav_item')
			.update({ label, href, sort_order, is_published, requires_auth })
			.eq('id', id);

		if (err) {
			console.error('admin/navigation/[id] update - error updating nav item', err);
			return fail(500, { errors: { general: 'Failed to update nav item.' } });
		}

		return { success: true };
	},

	delete: async ({ locals: { supabase }, params }) => {
		const id = Number(params.id);

		const { error: err } = await supabase.from('nav_item').delete().eq('id', id);

		if (err) {
			console.error('admin/navigation/[id] delete - error deleting nav item', err);
			return fail(500, { errors: { general: 'Failed to delete nav item.' } });
		}

		redirect(303, '/admin/navigation');
	}
};
