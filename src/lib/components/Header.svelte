<script lang="ts">
  import HeaderNavLink from './HeaderNavLink.svelte';
</script>

<header>
  <h1>Bookstall</h1>
  <p>Fantasy Novels</p>
  <hr />
  <nav>
    <ul>
      <HeaderNavLink to="/" title="Home" />
      <HeaderNavLink to="/authors" title="Authors" />
      <HeaderNavLink to="/books" title="Books" />
      <HeaderNavLink to="/stores" title="Stores" />
    </ul>
  </nav>
</header>

<style>
  header {
    background: var(--card-background-color);
    padding: 1em 1em 0.25em;
    text-align: center;
    text-transform: uppercase;
  }

  h1,
  p {
    font-family: Cormorant, serif;
    line-height: 1;
    margin: 0;
  }

  h1 {
    font-size: 3em;
  }

  p {
    font-size: 0.75em;
    letter-spacing: 1.1em;
    text-indent: 0.9em;
  }

  hr {
    width: 5em;
    margin: 1em auto -0.4em;
  }

  nav {
    justify-content: center;
  }
</style>
