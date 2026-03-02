import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase }, params: { locale, scope } }) => {
	const result = await supabase
		.from('local_text')
		.select(
			`
            *,
            locale!inner()
            `
		)
		.eq('locale.code', `${locale}`)
		.eq('scope', `${scope}`);

	if (result.error) {
		console.error('/api/local_text/[locale] GET failed', locale, scope);
		console.error(result.error);
		error(500, `Server error getting language content for locale: ${locale} and scope: ${scope}`);
	}

	return json(result.data);
};
