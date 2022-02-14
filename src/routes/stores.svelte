<script lang="ts">
  import getEditorErrors from '$lib/client/getEditorErrors';
  import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
  import trcp from '$lib/client/trpc';
  import DataTable from '$lib/components/DataTable.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import ModalEditor from '$lib/components/ModalEditor.svelte';
  import debounce from 'debounce';
  import { onMount } from 'svelte';

  type Store = InferMutationInput<'stores:save'>;
  type EditorErrors = { name?: string } | void;

  const newStore = (): Store => ({
    id: null,
    name: '',
    bookIds: []
  });

  let loading = true;
  let query = '';
  let stores: InferQueryOutput<'stores:browse'> = [];
  let books: InferQueryOutput<'books:list'> = [];
  let store = newStore();
  let editorVisible = false;
  let editorBusy = false;
  let editorErrors: EditorErrors;

  const load = async () => {
    loading = true;
    stores = await trcp.query('stores:browse', query);
    books = await trcp.query('books:list');
    loading = false;
  };

  onMount(load);

  const handleFilter = debounce((e: CustomEvent<string>) => {
    query = e.detail;
    load();
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
    const data = await trcp.query('stores:read', e.detail.itemKey);
    if (data) store = { ...data, bookIds: data.books.map(({ id }) => id) };
    editorBusy = false;
  };

  const handleDelete = async (e: CustomEvent<{ itemKey: string }>) => {
    loading = true;
    await trcp.mutation('stores:delete', e.detail.itemKey);
    load();
  };

  const handleEditorClose = () => {
    editorVisible = false;
    store = newStore();
    editorErrors = undefined;
  };

  const handleEditorSave = async () => {
    editorBusy = true;
    try {
      await trcp.mutation('stores:save', store);
      editorVisible = false;
      store = newStore();
      load();
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
    {
      title: 'Titles in stock',
      textAlign: 'right',
      render: ({ _count: { books } }) => books
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
    {#each books as { id, title, author: { firstName, lastName } } (id)}
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
