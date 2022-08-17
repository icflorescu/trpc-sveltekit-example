import trpc from '$lib/client/trpc';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
  const books = await trpc(fetch).query('books:browse');
  return { books };
};
