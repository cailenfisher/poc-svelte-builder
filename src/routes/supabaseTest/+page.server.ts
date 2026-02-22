import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/supabaseClient';

type Hello = {
  id: number;
  hello: string;
};

export const load: PageServerLoad = async () => {
  const { data, error } = await supabase.from('hello').select<'hello', Hello>().single();
console.log('data', data)
  if (error) {
    console.error('Error loading test table:', error.message);
    return { hello: "This was a failure" };
  }

  return {
    hello: data.hello ?? "No error but your data wasn't visible",
  };
};