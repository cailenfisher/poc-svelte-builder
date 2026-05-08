import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) error(401, 'Unauthorized');

	const { id, all } = await request.json();

	if (all) {
		const { error: err } = await supabase
			.from('notification')
			.update({ is_read: true })
			.eq('user_id', session.user.id)
			.eq('is_read', false);

		if (err) {
			console.error('api/notifications PATCH all - error', err);
			error(500, 'Failed to mark notifications as read');
		}
	} else {
		if (!id) error(400, 'Missing notification id');

		const { error: err } = await supabase
			.from('notification')
			.update({ is_read: true })
			.eq('id', id)
			.eq('user_id', session.user.id);

		if (err) {
			console.error('api/notifications PATCH - error', err);
			error(500, 'Failed to mark notification as read');
		}
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) error(401, 'Unauthorized');

	const { id } = await request.json();
	if (!id) error(400, 'Missing notification id');

	const { error: err } = await supabase
		.from('notification')
		.delete()
		.eq('id', id)
		.eq('user_id', session.user.id);

	if (err) {
		console.error('api/notifications DELETE - error', err);
		error(500, 'Failed to dismiss notification');
	}

	return json({ success: true });
};
