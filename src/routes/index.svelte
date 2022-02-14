<svelte:head>
  <title>A tRPC-SvelteKit Example Appplication • Bookstall</title>
</svelte:head>

<div class="root">
  <div class="content">
    <p class="emoji">😎</p>
    <p>
      Welcome to Bookstall, a sample SvelteKit application built to illustrate the usage of ✨
      <a href="https://github.com/icflorescu/trpc-sveltekit" target="_blank">trpc-sveltekit</a>.
      <br />
      No REST API routes are being used white you're managing books, authors and stores — all server-side
      method calls are performed through tRPC.
    </p>
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .content {
    margin-top: -4rem;
  }

  .emoji {
    font-size: 6rem;
  }
</style>
