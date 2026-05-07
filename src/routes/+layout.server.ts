import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();

	let dictionaryPayload = null;
	try {
		const result = await fetch('/api/local_text');
		dictionaryPayload = await result.json();
	} catch (e) {
		console.error('layout.server - error fetching localized content');
	}

	const { data: navItems } = await supabase
		.from('nav_item')
		.select('id, label, href, sort_order, is_published, requires_auth')
		.eq('is_published', true)
		.order('sort_order');

	return {
		session,
		user,
		cookies: cookies.getAll(),
		dictionaryPayload,
		navItems: navItems ?? []
	};
};
