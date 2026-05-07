import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const id = Number(params.id);

	const [linkRes, localesRes, translationsRes] = await Promise.all([
		supabase.from('local_text_link').select('id, slug, title, scope').eq('id', id).single(),
		supabase.from('locale').select('id, code, name, native_name, dir').order('name'),
		supabase
			.from('local_text')
			.select('id, content, locale!inner(id, code, name, native_name, dir)')
			.eq('link', id)
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
		translations: translationsRes.data ?? []
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

		return { success: true, action: 'link' as const };
	},

	upsertTranslation: async ({ request, locals: { supabase }, params }) => {
		const linkId = Number(params.id);
		const formData = await request.formData();
		const localeId = Number(formData.get('locale_id'));
		const content = (formData.get('content') as string)?.trim();

		if (!localeId || !content) {
			return fail(400, { errors: { general: 'Locale and content are required.' } });
		}

		const { data: existing } = await supabase
			.from('local_text')
			.select('id')
			.eq('link', linkId)
			.eq('locale', localeId)
			.maybeSingle();

		const upsertResult = existing
			? await supabase.from('local_text').update({ content: content }).eq('id', existing.id)
			: await supabase.from('local_text').insert({ link: linkId, locale: localeId, content });

		if (upsertResult.error) {
			console.error(
				'admin/content/[id] upsertTranslation - error saving translation',
				upsertResult.error
			);
			return fail(500, { errors: { general: 'Failed to save translation.' } });
		}

		return { success: true, action: 'translation' as const, savedLocaleId: localeId };
	},

	deleteTranslation: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = Number(formData.get('translation_id'));

		if (!id) return fail(400, { errors: { general: 'Invalid translation ID.' } });

		const { error: err } = await supabase.from('local_text').delete().eq('id', id);

		if (err) {
			console.error('admin/content/[id] deleteTranslation - error deleting translation', err);
			return fail(500, { errors: { general: 'Failed to remove translation.' } });
		}

		return { success: true, action: 'delete' as const };
	}
};
