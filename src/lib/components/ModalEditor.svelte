<script lang="ts">
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import BusyOverlay from './BusyOverlay.svelte';

  export let visible: boolean;
  export let busy: boolean;
  export let title: string;

  const dispatch = createEventDispatcher<{ save: never; close: never }>();

  const handleCancelClick = () => {
    dispatch('close');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') dispatch('close');
  };

  $: {
    if (browser) {
      visible
        ? window.addEventListener('keydown', handleKeyDown)
        : window.removeEventListener('keydown', handleKeyDown);
    }
  }
</script>

<dialog open={visible} on:click|self={handleCancelClick}>
  {#if visible}
    <article transition:fly={{ y: -200, duration: 100 }}>
      <header>
        <!-- svelte-ignore a11y-missing-content -->
        <a
          href="#close"
          aria-label="Close"
          class="close"
          on:click|preventDefault={handleCancelClick}
        />
        {title}
      </header>
      <slot />
      <footer>
        <a
          href="#cancel"
          role="button"
          class="secondary"
          on:click|preventDefault={handleCancelClick}>Cancel</a
        >
        <a href="#save" role="button" on:click|preventDefault={() => dispatch('save')}>Save</a>
      </footer>
      <BusyOverlay enabled={busy} />
    </article>
  {/if}
</dialog>

<style lang="scss">
  @use 'sass:map';
  @import '@picocss/pico/scss/variables';

  article {
    position: relative;
    @media (min-width: map.get($breakpoints, 'lg')) {
      width: 700px;
    }
  }
</style>
