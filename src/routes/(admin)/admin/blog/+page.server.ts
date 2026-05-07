import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: posts, error } = await supabase
		.from('post')
		.select('id, slug, is_published, published_at, created_at')
		.order('created_at', { ascending: false });

	if (error) console.error('admin/blog load - error fetching posts', error);

	return { posts: posts ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');

		if (!slug) return fail(400, { errors: { general: 'Slug is required.' } });
		if (!/^[a-z0-9-]+$/.test(slug))
			return fail(400, { errors: { general: 'Slug may only contain lowercase letters, numbers, and hyphens.' } });

		const { data, error } = await supabase.from('post').insert({ slug }).select('id').single();

		if (error) {
			console.error('admin/blog create - error inserting post', error);
			if (error.code === '23505')
				return fail(400, { errors: { general: `A post with slug "${slug}" already exists.` } });
			return fail(500, { errors: { general: 'Failed to create post.' } });
		}

		redirect(303, `/admin/blog/${data.id}`);
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { errors: { general: 'Invalid post ID.' } });

		const { error } = await supabase.from('post').delete().eq('id', id);
		if (error) {
			console.error('admin/blog delete - error deleting post', error);
			return fail(500, { errors: { general: 'Failed to delete post.' } });
		}

		redirect(303, '/admin/blog');
	}
};
