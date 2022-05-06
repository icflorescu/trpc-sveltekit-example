import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import authors from './authors';
import books from './books';
import stores from './stores';

export const createContext = () => ({});

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  .transformer(trpcTransformer)
  .merge('authors:', authors)
  .merge('books:', books)
  .merge('stores:', stores);

export type Router = typeof router;
