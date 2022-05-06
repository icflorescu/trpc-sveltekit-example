import type { Router } from '$lib/server/trpc';
import type { TRPCClientError } from '@trpc/client';

export default function (error: TRPCClientError<Router>) {
  if (error.data?.code !== 'BAD_REQUEST') {
    alert('Unknown error');
    return;
  }
  const errors: Record<string, string> = {};
  (JSON.parse(error.message) as { path: string[]; message: string }[]).forEach((err) => {
    errors[err.path[0]] = err.message;
  });
  return errors;
}
