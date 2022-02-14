<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant:wght@500&display=swap&text=BOOKSTALFNTYVE"
    rel="stylesheet"
  />
  <style lang="scss">
    @import '@picocss/pico/scss/pico.scss';

    html,
    body,
    body > div {
      height: 100%;
    }

    body > div {
      display: flex;
      flex-direction: column;
    }

    svg.icon {
      width: 24px;
      height: 24px;
      vertical-align: text-bottom;
    }
  </style>
</svelte:head>

<Header />
<main class="container">
  <slot />
</main>
<Footer />

<style>
  main {
    flex: 1 0 auto;
    padding: 2em 1em;
  }
</style>
