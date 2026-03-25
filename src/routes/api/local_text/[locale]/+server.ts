import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase }, params: { locale } }) => {
	const result = await supabase
		.from('local_text')
		.select(
			`
            *,
            locale!inner(),
			link!inner(id, slug, title, scope)
            `
		)
		.eq('locale.code', `${locale}`);

	if (result.error) {
		console.error('/api/local_text/[locale] GET failed', locale);
		console.error(result.error);
		error(500, `Server error getting language content for locale: ${locale}`);
	}

	return json(result.data);
};
