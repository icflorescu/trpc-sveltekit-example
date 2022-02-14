<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import IconPlus from './icons/IconPlus.svelte';

  export let title: string;
  export let filterDescription: string;

  const dispatch = createEventDispatcher<{ filter: string }>();
</script>

<div class="root">
  <h2>{title}</h2>
  <input
    class="filter"
    type="search"
    placeholder={`Filter by ${filterDescription}…`}
    on:input={(e) => dispatch('filter', e.currentTarget.value)}
  />
  <div class="button-container">
    <button on:click><IconPlus />Add</button>
  </div>
</div>

<style>
  .root {
    padding: var(--spacing);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border-width) dashed var(--table-border-color);
  }

  h2 {
    margin-bottom: 0;
  }

  .filter {
    margin: 0 1em !important;
  }

  .button-container {
    flex: 1 0 auto;
  }

  button {
    margin-bottom: 0;
  }
</style>
