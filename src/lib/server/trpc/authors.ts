import prismaClient from '$lib/server/prismaClient';
import { falsyToNull, trim } from '$lib/zodTransformers';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export default trpc
  .router()
  .query('browse', {
    input: z.string(),
    resolve: ({ input }) =>
      prismaClient.author.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          _count: { select: { books: true } },
          createdAt: true
        },
        where: input
          ? { OR: [{ firstName: { contains: input } }, { lastName: { contains: input } }] }
          : undefined,
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
      })
  })
  .query('list', {
    resolve: () =>
      prismaClient.author.findMany({
        select: { id: true, firstName: true, lastName: true },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
      })
  })
  .query('read', {
    input: z.string(),
    resolve: ({ input: id }) =>
      prismaClient.author.findUnique({
        where: { id },
        select: { id: true, firstName: true, lastName: true, bio: true }
      })
  })
  .mutation('save', {
    input: z.object({
      id: z.string(),
      firstName: z.string().min(3).max(50).transform(trim),
      lastName: z.string().min(3).max(50).transform(trim),
      bio: z.string().max(1000).transform(trim).transform(falsyToNull)
    }),
    resolve: ({ input: { id, ...data } }) =>
      id
        ? prismaClient.author.update({ data, where: { id }, select: { id: true } })
        : prismaClient.author.create({ data, select: { id: true } })
  })
  .mutation('delete', {
    input: z.string(),
    resolve: ({ input: id }) => prismaClient.author.delete({ where: { id } }).then(() => undefined)
  });
