import trpc from '$lib/client/trpc';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
  const trpcClient = trpc(fetch);
  const [stores, bookList] = await Promise.all([
    trpcClient.query('stores:browse'),
    trpcClient.query('books:list')
  ]);
  return { stores, bookList };
};
