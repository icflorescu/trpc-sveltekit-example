import trpc from '$lib/client/trpc';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
  const authors = await trpc(fetch).query('authors:browse');
  return { authors };
};
