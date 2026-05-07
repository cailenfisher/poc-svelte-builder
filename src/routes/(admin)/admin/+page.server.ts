import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const [localeRes, linkRes, translationRes] = await Promise.all([
		supabase.from('locale').select('id', { count: 'exact', head: true }),
		supabase.from('local_text_link').select('id', { count: 'exact', head: true }),
		supabase.from('local_text').select('id', { count: 'exact', head: true }),
	]);

	return {
		stats: {
			localeCount: localeRes.count ?? 0,
			linkCount: linkRes.count ?? 0,
			translationCount: translationRes.count ?? 0,
		},
	};
};
