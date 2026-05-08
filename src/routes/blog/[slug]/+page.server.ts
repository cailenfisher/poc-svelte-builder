import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const { data: post, error: err } = await supabase
		.from('post')
		.select('id, slug, is_published, published_at, created_at, updated_at')
		.eq('slug', params.slug)
		.eq('is_published', true)
		.single();

	if (err || !post) error(404, 'Post not found.');

	const { data: blogLinks } = await supabase
		.from('local_text_link')
		.select('id')
		.eq('scope', 'blog');

	const linkIds = (blogLinks ?? []).map((l: { id: number }) => l.id);

	let blogContent: any[] = [];
	if (linkIds.length > 0) {
		const { data } = await supabase
			.from('local_text')
			.select(
				`id, scoped_content_id, content, locale!inner(id, code, name, native_name, dir), link!inner(id, slug, title, scope)`
			)
			.in('link', linkIds)
			.eq('scoped_content_id', post.id);
		blogContent = data ?? [];
	}

	return { post, blogContent };
};
