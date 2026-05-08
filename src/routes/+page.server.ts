import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: posts } = await supabase
		.from('post')
		.select('id, slug, is_published, published_at, created_at, updated_at')
		.eq('is_published', true)
		.order('published_at', { ascending: false });

	const { data: blogLinks } = await supabase
		.from('local_text_link')
		.select('id')
		.eq('scope', 'blog');

	const linkIds = (blogLinks ?? []).map((l: { id: number }) => l.id);
	const postIds = (posts ?? []).map((p: { id: number }) => p.id);

	let blogContent: any[] = [];
	if (linkIds.length > 0 && postIds.length > 0) {
		const { data } = await supabase
			.from('local_text')
			.select(
				`id, scoped_content_id, content, locale!inner(id, code, name, native_name, dir), link!inner(id, slug, title, scope)`
			)
			.in('link', linkIds)
			.in('scoped_content_id', postIds);
		blogContent = data ?? [];
	}

	return { posts: posts ?? [], blogContent };
};
