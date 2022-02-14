import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformers';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export default trpc
  .router()
  .query('browse', {
    input: z.string(),
    resolve: ({ input }) =>
      prismaClient.store.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { books: true } },
          createdAt: true
        },
        where: input ? { name: { contains: input } } : undefined,
        orderBy: [{ name: 'asc' }]
      })
  })
  .query('read', {
    input: z.string(),
    resolve: ({ input: id }) =>
      prismaClient.store.findUnique({
        where: { id },
        select: { id: true, name: true, books: { select: { id: true } } }
      })
  })
  .mutation('save', {
    input: z.object({
      id: z.string().nullable(),
      name: z.string().min(3).max(50).transform(trim),
      bookIds: z.array(z.string())
    }),
    resolve: ({ input: { id, bookIds, ...data } }) =>
      id
        ? prismaClient.store.update({
            where: { id },
            data: { ...data, books: { set: bookIds.map((bookId) => ({ id: bookId })) } },
            select: { id: true }
          })
        : prismaClient.store.create({
            data: { ...data, books: { connect: bookIds.map((bookId) => ({ id: bookId })) } }
          })
  })
  .mutation('delete', {
    input: z.string(),
    resolve: ({ input: id }) => prismaClient.store.delete({ where: { id } }).then(() => undefined)
  });
