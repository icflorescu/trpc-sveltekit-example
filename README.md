# 😎 tRPC-SvelteKit-Example

[![License][license-image]][license-url]

A sample SvelteKit application built to illustrate the usage of [trpc-sveltekit](https://github.com/icflorescu/trpc-sveltekit).

<a href="https://githubbox.com/icflorescu/trpc-sveltekit-example" target="_blank"><img src="https://user-images.githubusercontent.com/581999/153951643-a4e60c17-5c04-40e7-af2f-88e4a3ba354c.png" /></a>

## Developing

Once you've installed the dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of this app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Running the production version

To run the production version of this app:

```bash
node build
```

## Recipes 🛠

### Using Prisma in your tRPC router:

When you're building your SvelteKit app for production, you must instantiate your Prisma client **like this**:

```ts
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prismaClient = new PrismaClient();
export default prismaClient;
```

This will **not** work:

```ts
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();
export default prismaClient;
```

### Using superjson with Decimal.js / Prisma.Decimal

By default, superjson only supports built-in data types to keep the bundle-size as small as possible. Here's how you extend it with with Decimal.js / Prisma.Decimal:

```ts
// $lib/trpcTransformer.ts
import Decimal from 'decimal.js';
import superjson from 'superjson';

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v)
  },
  'decimal.js'
);

export default superjson;
```

Then, configure your tRPC router like so:

```ts
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/server';

export const router = trpc.router().transformer(trpcTransformer); // 👈
// .merge, .query, .mutation, etc.

export type Router = typeof router;
```

...and don't forget to configure your tRPC client:

```ts
import type { Router } from '$lib/server/trpc';
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

const client = trpc.createTRPCClient<Router>({
  url: '/trpc',
  transformer: trpcTransformer // 👈
});
```

You'll also have to use this custom `svelte.config.js` in order to be able to build your application for production with `adapter-node`:

```js
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    vite:
      process.env.NODE_ENV === 'production'
        ? {
            ssr: {
              noExternal: ['superjson']
            }
          }
        : undefined
  }
};

export default config;
```

## License

The [ISC License](https://github.com/icflorescu/trpc-sveltekit/blob/master/LICENSE).

[license-image]: http://img.shields.io/npm/l/trpc-sveltekit.svg?style=flat-square
[license-url]: LICENSE
