<script context="module" lang="ts">
  import getEditorErrors from '$lib/client/getEditorErrors';
  import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
  import trpc from '$lib/client/trpc';
  import DataTable from '$lib/components/DataTable.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import TextareaInput from '$lib/components/inputs/TextareaInput.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import ModalEditor from '$lib/components/ModalEditor.svelte';
  import type { Load } from '@sveltejs/kit';
  import formatDistanceToNow from 'date-fns/formatDistanceToNow';
  import debounce from 'debounce';

  export const load: Load = async () => {
    const books = await trpc.query('books:browse');
    return { props: { books } };
  };
</script>

<script lang="ts">
  type Book = InferMutationInput<'books:save'>;
  type EditorErrors = {
    title?: string;
    authorId?: string;
    price?: string;
    excerpt?: string;
  } | void;

  const newBook = (): Book => ({
    id: null,
    title: '',
    authorId: '',
    price: '',
    excerpt: ''
  });

  let loading = false;
  let query = '';
  export let books: InferQueryOutput<'books:browse'> = [];
  let book = newBook();
  let editorVisible = false;
  let editorBusy = false;
  let editorErrors: EditorErrors;

  const reloadBooks = async () => {
    loading = true;
    books = await trpc.query('books:browse', query);
    loading = false;
  };

  const getAuthorOptions = () =>
    trpc.query('authors:list').then((authors) =>
      authors.map(({ id, firstName, lastName }) => ({
        value: id,
        label: `${firstName} ${lastName}`
      }))
    );

  const handleFilter = debounce((e: CustomEvent<string>) => {
    query = e.detail;
    reloadBooks();
  }, 500);

  const handleAdd = () => {
    book = newBook();
    editorErrors = undefined;
    editorVisible = true;
  };

  const handleEdit = async (e: CustomEvent<{ itemKey: string }>) => {
    editorErrors = undefined;
    editorBusy = true;
    editorVisible = true;
    const data = await trpc.query('books:read', e.detail.itemKey);
    if (data) book = { ...data, price: data.price.toFixed(2), excerpt: data.excerpt || '' };
    editorBusy = false;
  };

  const handleDelete = async (e: CustomEvent<{ itemKey: string }>) => {
    loading = true;
    await trpc.mutation('books:delete', e.detail.itemKey);
    reloadBooks();
  };

  const handleEditorClose = () => {
    editorVisible = false;
    book = newBook();
    editorErrors = undefined;
  };

  const handleEditorSave = async () => {
    editorBusy = true;
    try {
      await trpc.mutation('books:save', book);
      editorVisible = false;
      book = newBook();
      reloadBooks();
    } catch (err) {
      editorErrors = getEditorErrors(err);
    }
    editorBusy = false;
  };
</script>

<svelte:head>
  <title>Books • Bookstall</title>
</svelte:head>

<DataTable
  {loading}
  title="Books"
  filterDescription="title or author"
  items={books}
  key="id"
  columns={[
    { title: 'Title', prop: 'title' },
    {
      title: 'Author',
      render: ({ author: { firstName, lastName } }) => `${firstName} ${lastName}`
    },
    { title: 'Price', render: ({ price }) => price.toFixed(2), textAlign: 'right' },
    {
      title: 'Last updated',
      render: ({ updatedAt }) => formatDistanceToNow(updatedAt) + ' ago',
      textAlign: 'right'
    }
  ]}
  on:filter={handleFilter}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  title={book.id ? book.title : 'New book'}
  visible={editorVisible}
  busy={editorBusy}
  on:close={handleEditorClose}
  on:save={handleEditorSave}
>
  <TextInput label="Title" required bind:value={book.title} error={editorErrors?.title} />
  <div class="grid">
    <Select
      label="Author"
      required
      getOptions={getAuthorOptions}
      bind:value={book.authorId}
      error={editorErrors?.authorId}
    />
    <TextInput label="Price" required bind:value={book.price} error={editorErrors?.price} />
  </div>
  <TextareaInput label="Excerpt" bind:value={book.excerpt} error={editorErrors?.excerpt} />
</ModalEditor>
