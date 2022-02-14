<script lang="ts">
  import LabelAsterisk from './LabelAsterisk.svelte';

  let textarea: HTMLTextAreaElement;

  export let label: string;
  export let required = false;
  export let placeholder = '';
  export let value = '';
  export let error: string | void;

  const autosize = () => {
    requestAnimationFrame(() => {
      if (textarea) {
        textarea.style.height = '0';
        textarea.style.height = `${textarea.scrollHeight + 2}px`;
      }
    });
  };

  $: value, autosize();
</script>

<label>
  {label}<LabelAsterisk {required} />
  <textarea
    bind:this={textarea}
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
  textarea {
    resize: none;
    min-height: calc(
      var(--line-height) * var(--font-size) +
        (var(--border-width) + var(--form-element-spacing-vertical)) * 2
    );
    max-height: 200px;
  }

  small {
    color: var(--form-element-invalid-active-border-color);
  }
</style>
