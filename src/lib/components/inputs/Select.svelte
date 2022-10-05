<script lang="ts">
  import { onMount } from 'svelte';
  import LabelAsterisk from './LabelAsterisk.svelte';

  type Option = { value: string; label: string };

  export let label: string;
  export let getOptions: () => Promise<Option[]>;
  export let value = '';
  export let required = false;
  export let error: string | void;

  let options: Option[] = [];
  let loading = false;

  const load = async () => {
    loading = true;
    options = await getOptions();
    loading = false;
  };

  onMount(load);
</script>

<label aria-busy={loading}>
  {label}<LabelAsterisk {required} />
  <select bind:value on:focus={load} aria-invalid={error ? 'true' : undefined}>
    <option value="">Select...</option>
    {#each options as { value, label } (value)}
      <option {value}>{label}</option>
    {/each}
  </select>
  {#if error}
    <small>{error}</small>
  {/if}
</label>

<style>
  small {
    color: var(--form-element-invalid-active-border-color);
  }
</style>
