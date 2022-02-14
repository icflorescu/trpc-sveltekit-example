<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let loading: boolean;
  export let columnsLength: number;
  export let itemsPluralName: string;

  const dispatch = createEventDispatcher<{ add: never }>();
</script>

<tr>
  <td colspan={columnsLength + 1}>
    {#if loading}Loading...{:else}No {itemsPluralName} found.<br />Why don't you
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={() => dispatch('add')}>add one</a>?{/if}
  </td>
</tr>

<style>
  td {
    padding-top: 3em;
    padding-bottom: 3em;
    text-align: center;
  }

  a {
    cursor: pointer;
  }
</style>
