<script context="module" lang="ts">
  import getEditorErrors from '$lib/client/getEditorErrors';
  import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
  import trpc from '$lib/client/trpc';
  import DataTable from '$lib/components/DataTable.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import ModalEditor from '$lib/components/ModalEditor.svelte';
  import type { Load } from '@sveltejs/kit';
  import { formatDistanceToNow } from 'date-fns';
  import debounce from 'debounce';

  export const load: Load = async ({ fetch }) => {
    const stores = await trpc(fetch).query('stores:browse');
    const bookList = await trpc(fetch).query('books:list');
    return { props: { stores, bookList } };
  };
</script>

<script lang="ts">
  type Store = InferMutationInput<'stores:save'>;
  type EditorErrors = { name?: string } | void;

  const newStore = (): Store => ({
    id: null,
    name: '',
    bookIds: []
  });

  let loading = false;
  let query = '';
  export let stores: InferQueryOutput<'stores:browse'> = [];
  export let bookList: InferQueryOutput<'books:list'> = [];
  let store = newStore();
  let editorVisible = false;
  let editorBusy = false;
  let editorErrors: EditorErrors;

  const reloadStores = async () => {
    loading = true;
    stores = await trpc().query('stores:browse', query);
    loading = false;
  };

  const reloadBooks = async () => {
    editorBusy = true;
    bookList = await trpc().query('books:list');
    editorBusy = false;
  };

  $: if (editorBusy) reloadBooks();

  const handleFilter = debounce((e: CustomEvent<string>) => {
    query = e.detail;
    reloadStores();
  }, 500);

  const handleAdd = () => {
    store = newStore();
    editorErrors = undefined;
    editorVisible = true;
  };

  const handleEdit = async (e: CustomEvent<{ itemKey: string }>) => {
    editorErrors = undefined;
    editorBusy = true;
    editorVisible = true;
    const data = await trpc().query('stores:read', e.detail.itemKey);
    if (data) store = { ...data, bookIds: data.books.map(({ id }) => id) };
    editorBusy = false;
  };

  const handleDelete = async (e: CustomEvent<{ itemKey: string }>) => {
    loading = true;
    await trpc().mutation('stores:delete', e.detail.itemKey);
    reloadStores();
  };

  const handleEditorClose = () => {
    editorVisible = false;
    store = newStore();
    editorErrors = undefined;
  };

  const handleEditorSave = async () => {
    editorBusy = true;
    try {
      await trpc().mutation('stores:save', store);
      editorVisible = false;
      store = newStore();
      reloadStores();
    } catch (err) {
      editorErrors = getEditorErrors(err);
    }
    editorBusy = false;
  };
</script>

<svelte:head>
  <title>Stores • Bookstall</title>
</svelte:head>

<DataTable
  {loading}
  title="Stores"
  filterDescription="name"
  items={stores}
  key="id"
  columns={[
    { title: 'Name', prop: 'name' },
    { title: 'Titles in stock', textAlign: 'right', render: (store) => store._count.books },
    {
      title: 'Last updated',
      textAlign: 'right',
      render: ({ updatedAt }) => formatDistanceToNow(updatedAt) + ' ago'
    }
  ]}
  on:filter={handleFilter}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  title={store.id ? store.name : 'New store'}
  visible={editorVisible}
  busy={editorBusy}
  on:close={handleEditorClose}
  on:save={handleEditorSave}
>
  <TextInput label="Name" required bind:value={store.name} error={editorErrors?.name} />
  <fieldset>
    <legend>Titles in stock</legend>
    {#each bookList as { id, title, author: { firstName, lastName } } (id)}
      <label>
        <input type="checkbox" bind:group={store.bookIds} value={id} />
        {title} <em class="author">by {firstName} {lastName}</em>
      </label>
    {/each}
  </fieldset>
</ModalEditor>

<style>
  .author {
    opacity: 0.33;
  }
</style>
