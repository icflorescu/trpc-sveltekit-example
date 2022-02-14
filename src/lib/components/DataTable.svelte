<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BusyOverlay from './BusyOverlay.svelte';
  import DataTableHeader from './DataTableHeader.svelte';
  import DataTableStatus from './DataTableStatus.svelte';
  import IconDelete from './icons/IconDelete.svelte';
  import IconDotsVertical from './icons/IconDotsVertical.svelte';
  import IconEdit from './icons/IconEdit.svelte';

  type T = $$Generic;

  export let title: string;
  export let filterDescription: string;
  export let loading: boolean;
  export let items: T[];
  export let key: keyof T;
  export let columns: ({ title: string; textAlign?: 'center' | 'right' } & (
    | { prop: keyof T; render?: never }
    | { prop?: never; render: (item: T) => string | number }
  ))[];

  const dispatch = createEventDispatcher<{
    add: never;
    edit: { itemKey: unknown };
    delete: { itemKey: unknown };
  }>();

  const handleAddClick = () => {
    dispatch('add');
  };
</script>

<div class="root">
  <DataTableHeader {title} on:click={handleAddClick} {filterDescription} on:filter />
  <table>
    <thead>
      <tr>
        <th class="number">#</th>
        {#each columns as { title, textAlign } (title)}
          <th style:text-align={textAlign || 'left'}>{title}</th>
        {/each}
        <th class="actions"><IconDotsVertical /></th>
      </tr>
    </thead>
    <tbody>
      {#each items as item, index (item[key])}
        <tr>
          <td class="number">{index + 1}</td>
          {#each columns as { prop, title, textAlign, render } (title)}
            <td style:text-align={textAlign || 'left'}>{prop ? item[prop] : render?.(item)}</td>
          {/each}
          <td class="actions">
            <span class="action" on:click={() => dispatch('edit', { itemKey: item[key] })}>
              <IconEdit />
            </span>
            <span class="action danger" on:click={() => dispatch('delete', { itemKey: item[key] })}>
              <IconDelete />
            </span>
          </td>
        </tr>
      {:else}
        <DataTableStatus
          {loading}
          itemsPluralName={title.toLowerCase()}
          columnsLength={columns.length}
          on:add
        />
      {/each}
    </tbody>
  </table>
  <BusyOverlay enabled={loading} />
</div>

<style lang="scss">
  .root {
    position: relative;
    overflow: hidden;
    border: var(--border-width) solid var(--table-border-color);
    border-radius: var(--border-radius);
    background: var(--card-background-color);
  }

  table {
    margin-bottom: 0;
    :global(tbody tr:last-child td) {
      border-bottom: 0;
    }
  }

  th.number {
    text-align: right;
    width: 0;
  }

  td.number {
    text-align: right;
  }

  th.actions {
    text-align: right;
    width: 0;
  }

  td.actions {
    text-align: right;
    white-space: nowrap;
  }

  .action {
    cursor: pointer;
    &:not(:first-child) {
      margin-left: 0.25em;
    }
    opacity: 0.75;
    color: var(--primary);
    transition: opacity 0.2s;
    &:hover {
      opacity: 1;
    }
    &.danger {
      color: var(--del-color);
    }
  }
</style>
