import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: navItems, error } = await supabase
		.from('nav_item')
		.select('id, label, href, sort_order, is_published, requires_auth')
		.order('sort_order');

	if (error) {
		console.error('admin/navigation load - error fetching nav items', error);
	}

	return { navItems: navItems ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const label = (formData.get('label') as string)?.trim();
		const href = (formData.get('href') as string)?.trim();
		const sort_order = Number(formData.get('sort_order') ?? 0);
		const requires_auth = formData.get('requires_auth') === 'true';

		if (!label || !href) {
			return fail(400, { errors: { general: 'Label and href are required.' } });
		}

		const { error } = await supabase
			.from('nav_item')
			.insert({ label, href, sort_order, is_published: true, requires_auth });

		if (error) {
			console.error('admin/navigation create - error inserting nav item', error);
			return fail(500, { errors: { general: 'Failed to create nav item.' } });
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { errors: { general: 'Invalid nav item ID.' } });

		const { error } = await supabase.from('nav_item').delete().eq('id', id);

		if (error) {
			console.error('admin/navigation delete - error deleting nav item', error);
			return fail(500, { errors: { general: 'Failed to delete nav item.' } });
		}

		redirect(303, '/admin/navigation');
	}
};
