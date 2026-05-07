import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: links, error } = await supabase
		.from('local_text_link')
		.select('id, slug, title, scope')
		.order('slug');

	if (error) {
		console.error('admin/content load - error fetching content links', error);
	}

	return { links: links ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const slug = (formData.get('slug') as string)?.trim().toLowerCase();
		const title = (formData.get('title') as string)?.trim();
		const scope = (formData.get('scope') as string)?.trim() || null;

		if (!slug || !title) {
			return fail(400, { errors: { general: 'Slug and title are required.' } });
		}

		if (!/^[a-z0-9_]+$/.test(slug)) {
			return fail(400, { errors: { general: 'Slug may only contain lowercase letters, numbers, and underscores.' } });
		}

		const { error } = await supabase
			.from('local_text_link')
			.insert({ slug, title, scope });

		if (error) {
			console.error('admin/content create - error inserting link', error);
			if (error.code === '23505') {
				return fail(400, { errors: { general: `A content link with slug "${slug}" already exists.` } });
			}
			return fail(500, { errors: { general: 'Failed to create content link. Please try again.' } });
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { errors: { general: 'Invalid ID.' } });

		const { error } = await supabase.from('local_text_link').delete().eq('id', id);

		if (error) {
			console.error('admin/content delete - error deleting link', error);
			return fail(500, { errors: { general: 'Failed to delete content link.' } });
		}

		redirect(303, '/admin/content');
	},
};
