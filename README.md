# 😎 tRPC-SvelteKit-Example

[![License][license-image]][license-url]

A sample SvelteKit application built to illustrate the usage of [trpc-sveltekit](https://github.com/icflorescu/trpc-sveltekit).

## CodeSandbox

Open it directly in CodeSandbox:

[![Open in CodeSandbox](https://user-images.githubusercontent.com/581999/153951643-a4e60c17-5c04-40e7-af2f-88e4a3ba354c.png)](https://githubbox.com/icflorescu/trpc-sveltekit-example)

## Screenshot

![View trpc-sveltekit-bookstall Example](https://user-images.githubusercontent.com/581999/153968828-032be743-3e49-4709-8958-b0d9ec563b7f.png)

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

## Recipes, caveats, gists 🛠

See [trpc-sveltekit](https://github.com/icflorescu/trpc-sveltekit) for detailed information related to issues you may encounter when setting up with Prisma, superjson, deploying to Vercel, etc.

## Warning ❗

❌ This example won't work on Vercel because it's set up to use a local SQLite database.
✔️ [trpc-sveltekit](https://github.com/icflorescu/trpc-sveltekit), however, does.

## License

The [ISC License](https://github.com/icflorescu/trpc-sveltekit/blob/master/LICENSE).

[license-image]: http://img.shields.io/npm/l/trpc-sveltekit.svg?style=flat-square
[license-url]: LICENSE
