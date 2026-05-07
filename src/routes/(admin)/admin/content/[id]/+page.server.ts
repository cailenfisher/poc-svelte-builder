import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const id = Number(params.id);

	const [linkRes, localesRes, translationsRes] = await Promise.all([
		supabase
			.from('local_text_link')
			.select('id, slug, title, scope')
			.eq('id', id)
			.single(),
		supabase
			.from('locale')
			.select('id, code, name, native_name, dir')
			.order('name'),
		supabase
			.from('local_text')
			.select('id, content, locale!inner(id, code)')
			.eq('link', id),
	]);

	if (linkRes.error || !linkRes.data) {
		error(404, 'Content link not found.');
	}

	if (localesRes.error) {
		console.error('admin/content/[id] load - error fetching locales', localesRes.error);
	}

	if (translationsRes.error) {
		console.error('admin/content/[id] load - error fetching translations', translationsRes.error);
	}

	return {
		link: linkRes.data,
		locales: localesRes.data ?? [],
		translations: translationsRes.data ?? [],
	};
};

export const actions: Actions = {
	updateLink: async ({ request, locals: { supabase }, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const slug = (formData.get('slug') as string)?.trim().toLowerCase();
		const title = (formData.get('title') as string)?.trim();
		const scope = (formData.get('scope') as string)?.trim() || null;

		if (!slug || !title) {
			return fail(400, { errors: { general: 'Slug and title are required.' } });
		}

		const { error: err } = await supabase
			.from('local_text_link')
			.update({ slug, title, scope })
			.eq('id', id);

		if (err) {
			console.error('admin/content/[id] updateLink - error updating link', err);
			return fail(500, { errors: { general: 'Failed to update content link.' } });
		}

		return { success: true, action: 'link', message: 'Link updated.' };
	},

	upsertTranslations: async ({ request, locals: { supabase }, params }) => {
		const linkId = Number(params.id);
		const formData = await request.formData();

		const rows: { link: number; locale: number; content: string }[] = [];

		for (const [key, value] of formData.entries()) {
			if (key.startsWith('content_')) {
				const localeId = Number(key.replace('content_', ''));
				const content = (value as string).trim();
				if (content) {
					rows.push({ link: linkId, locale: localeId, content });
				}
			}
		}

		if (rows.length === 0) {
			return { success: true, action: 'translations', message: 'No changes to save.' };
		}

		const { error: err } = await supabase
			.from('local_text')
			.upsert(rows, { onConflict: 'link,locale' });

		if (err) {
			console.error('admin/content/[id] upsertTranslations - error upserting translations', err);
			return fail(500, { errors: { general: 'Failed to save translations.' } });
		}

		return { success: true, action: 'translations', message: 'Translations saved.' };
	},
};
