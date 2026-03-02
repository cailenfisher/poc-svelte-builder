import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase } }) => {
	const result = await supabase.from('local_text').select();

	if (result.error) {
		console.error('/api/local_text GET failed');
		error(500, 'Server error getting language content');
	}

	return json(result.data);
};
