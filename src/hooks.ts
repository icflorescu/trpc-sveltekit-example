import { createContext, router } from '$lib/server/trpc';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = createTRPCHandle({ router, createContext });
