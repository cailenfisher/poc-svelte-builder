import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const id = Number(params.id);

	const { data: post, error: postErr } = await supabase
		.from('post')
		.select('id, slug, is_published, published_at, created_at, updated_at')
		.eq('id', id)
		.single();

	if (postErr || !post) error(404, 'Post not found.');

	const [localesRes, blogLinksRes] = await Promise.all([
		supabase.from('locale').select('id, code, name, native_name, dir').order('name'),
		supabase.from('local_text_link').select('id, slug, title, scope').eq('scope', 'blog')
	]);

	if (localesRes.error) console.error('admin/blog/[id] load - error fetching locales', localesRes.error);
	if (blogLinksRes.error) console.error('admin/blog/[id] load - error fetching blog links', blogLinksRes.error);

	const blogLinks = blogLinksRes.data ?? [];
	const linkIds = blogLinks.map((l) => l.id);

	let translations: any[] = [];
	if (linkIds.length > 0) {
		const { data, error: transErr } = await supabase
			.from('local_text')
			.select('id, content, link, locale!inner(id, code, name, native_name, dir)')
			.in('link', linkIds)
			.eq('scoped_content_id', id);
		if (transErr) console.error('admin/blog/[id] load - error fetching translations', transErr);
		translations = data ?? [];
	}

	return {
		post,
		locales: localesRes.data ?? [],
		blogLinks,
		translations
	};
};

export const actions: Actions = {
	updateMeta: async ({ request, locals: { supabase }, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
		const is_published = formData.get('is_published') === 'on';
		let published_at = (formData.get('published_at') as string)?.trim() || null;

		if (!slug) return fail(400, { errors: { general: 'Slug is required.' } });
		if (!/^[a-z0-9-]+$/.test(slug))
			return fail(400, { errors: { general: 'Slug may only contain lowercase letters, numbers, and hyphens.' } });

		if (is_published && !published_at) {
			published_at = new Date().toISOString();
		}

		const { error: err } = await supabase
			.from('post')
			.update({ slug, is_published, published_at })
			.eq('id', id);

		if (err) {
			console.error('admin/blog/[id] updateMeta - error updating post', err);
			if (err.code === '23505')
				return fail(400, { errors: { general: `A post with slug "${slug}" already exists.` } });
			return fail(500, { errors: { general: 'Failed to update post.' } });
		}

		return { success: true, action: 'meta' as const };
	},

	upsertTranslation: async ({ request, locals: { supabase }, params }) => {
		const postId = Number(params.id);
		const formData = await request.formData();
		const linkId = Number(formData.get('link_id'));
		const localeId = Number(formData.get('locale_id'));
		const scopedContentId = Number(formData.get('scoped_content_id')) || postId;
		const content = (formData.get('content') as string)?.trim();

		if (!linkId || !localeId || !content)
			return fail(400, { errors: { general: 'Link, locale, and content are required.' } });

		const { data: existing } = await supabase
			.from('local_text')
			.select('id')
			.eq('link', linkId)
			.eq('locale', localeId)
			.eq('scoped_content_id', scopedContentId)
			.maybeSingle();

		const upsertResult = existing
			? await supabase.from('local_text').update({ content }).eq('id', existing.id)
			: await supabase
					.from('local_text')
					.insert({ link: linkId, locale: localeId, scoped_content_id: scopedContentId, content });

		if (upsertResult.error) {
			console.error('admin/blog/[id] upsertTranslation - error saving translation', upsertResult.error);
			return fail(500, { errors: { general: 'Failed to save translation.' } });
		}

		return { success: true, action: 'translation' as const, savedLocaleId: localeId, savedLinkId: linkId };
	},

	deleteTranslation: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = Number(formData.get('translation_id'));

		if (!id) return fail(400, { errors: { general: 'Invalid translation ID.' } });

		const { error: err } = await supabase.from('local_text').delete().eq('id', id);

		if (err) {
			console.error('admin/blog/[id] deleteTranslation - error deleting translation', err);
			return fail(500, { errors: { general: 'Failed to remove translation.' } });
		}

		return { success: true, action: 'delete' as const };
	}
};
