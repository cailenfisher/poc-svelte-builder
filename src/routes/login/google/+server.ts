import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:5173',
  },
})

if (data.url) {
  redirect(303, data.url) // use the redirect API for your server framework
}

  redirect(303, '/auth/error');
};