import prismaClient from '$lib/server/prismaClient';
import { falsyToNull, trim } from '$lib/zodTransformers';
import * as trpc from '@trpc/server';
import Decimal from 'decimal.js';
import { z } from 'zod';

export default trpc
  .router()
  .query('browse', {
    input: z.string().optional(),
    resolve: ({ input }) =>
      prismaClient.book.findMany({
        select: {
          id: true,
          title: true,
          author: { select: { firstName: true, lastName: true } },
          price: true,
          updatedAt: true
        },
        where: input
          ? {
              OR: [
                { title: { contains: input } },
                { author: { firstName: { contains: input } } },
                { author: { lastName: { contains: input } } }
              ]
            }
          : undefined,
        orderBy: [{ title: 'asc' }]
      })
  })
  .query('list', {
    resolve: () =>
      prismaClient.book.findMany({
        select: { id: true, title: true, author: { select: { firstName: true, lastName: true } } },
        orderBy: [{ title: 'asc' }]
      })
  })
  .query('read', {
    input: z.string(),
    resolve: ({ input: id }) =>
      prismaClient.book.findUnique({
        where: { id },
        select: { id: true, title: true, authorId: true, price: true, excerpt: true }
      })
  })
  .mutation('save', {
    input: z.object({
      id: z.string().nullable(),
      title: z.string().min(3).max(50).transform(trim),
      authorId: z.string().min(1, 'Should be selected'),
      price: z.string().refine(
        (val) => {
          try {
            new Decimal(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: 'Valid number required' }
      ),
      excerpt: z.string().max(1000).transform(trim).transform(falsyToNull)
    }),
    resolve: ({ input: { id, ...data } }) =>
      id
        ? prismaClient.book.update({ data, where: { id }, select: { id: true } })
        : prismaClient.book.create({ data, select: { id: true } })
  })
  .mutation('delete', {
    input: z.string(),
    resolve: ({ input: id }) => prismaClient.book.delete({ where: { id } }).then(() => undefined)
  });
