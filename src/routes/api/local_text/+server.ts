import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase } }) => {
	//#
	// this query produces very bloated payloads, with redundant locale and link/slug objects etc
	// good enough for POC, but this should be reworked before beta release
	// evaluate best options - something like:
	// pull locales once early on and store them for reference - locale becomes numeric id in local_content object
	// flatten 'link' child object into top level local_content item properties ('slug', and optional scope params)
	// processed dictionary should be a set or indexed array (research performance difference) with probably just one flat object per piece of content
	// this should happen in the dictionary setup, but optionally expect a pre-optimized payload and console.warn when not recieving optimized payloads
	const result = await supabase.from('local_text').select(
		`
        id,
        scoped_content_id,
        content,
        locale!inner(id, code, name, native_name, dir),
        link!inner(id, slug, title, scope)
        `
	);

	if (result.error) {
		console.error('/api/local_text GET failed');
		console.error(result.error);
		error(500, 'Server error getting language content');
	}

	return json(result.data);
};
