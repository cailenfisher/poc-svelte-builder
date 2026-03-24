import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, fetch }) => {
	const { session, user } = await safeGetSession();
	let dictionaryPayload = null;

	try {
		const result = await fetch('/api/local_text/en');
		dictionaryPayload = await result.json();
	} catch (e) {
		console.error('layout.server - error fetching localized content');
	}

	return {
		session,
		user,
		cookies: cookies.getAll(),
		dictionaryPayload
	};
};
