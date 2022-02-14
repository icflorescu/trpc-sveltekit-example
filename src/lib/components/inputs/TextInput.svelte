<script lang="ts">
  import LabelAsterisk from './LabelAsterisk.svelte';

  export let label: string;
  export let required = false;
  export let placeholder = '';
  export let value: string;
  export let error: string | void;
</script>

<label>
  {label}<LabelAsterisk {required} />
  <input
    type="text"
    {placeholder}
    {required}
    aria-invalid={error ? 'true' : undefined}
    bind:value
  />
  {#if error}
    <small>{error}</small>
  {/if}
</label>

<style>
  small {
    color: var(--form-element-invalid-active-border-color);
  }
</style>
