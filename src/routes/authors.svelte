<script context="module" lang="ts">
  import getEditorErrors from '$lib/client/getEditorErrors';
  import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
  import trpc from '$lib/client/trpc';
  import DataTable from '$lib/components/DataTable.svelte';
  import TextareaInput from '$lib/components/inputs/TextareaInput.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import ModalEditor from '$lib/components/ModalEditor.svelte';
  import type { Load } from '@sveltejs/kit';
  import debounce from 'debounce';

  export const load: Load = async () => {
    const authors = await trpc.query('authors:browse');
    return { props: { authors } };
  };
</script>

<script lang="ts">
  type Author = InferMutationInput<'authors:save'>;
  type EditorErrors = {
    firstName?: string;
    lastName?: string;
    bio?: string;
  } | void;

  const newAuthor = (): Author => ({
    id: '',
    firstName: '',
    lastName: '',
    bio: ''
  });

  let loading = false;
  let query = '';
  export let authors: InferQueryOutput<'authors:browse'> = [];
  let author = newAuthor();
  let editorErrors: EditorErrors;
  let editorVisible = false;
  let editorBusy = false;

  const reloadAuthors = async () => {
    loading = true;
    authors = await trpc.query('authors:browse', query);
    loading = false;
  };

  const handleFilter = debounce((e: CustomEvent<string>) => {
    query = e.detail;
    reloadAuthors();
  }, 500);

  const handleAdd = () => {
    author = newAuthor();
    editorErrors = undefined;
    editorVisible = true;
  };

  const handleEdit = async (e: CustomEvent<{ itemKey: string }>) => {
    editorErrors = undefined;
    editorBusy = true;
    editorVisible = true;
    const data = await trpc.query('authors:read', e.detail.itemKey);
    if (data) author = { ...data, bio: data.bio || '' };
    editorBusy = false;
  };

  const handleDelete = async (e: CustomEvent<{ itemKey: string }>) => {
    loading = true;
    await trpc.mutation('authors:delete', e.detail.itemKey);
    reloadAuthors();
  };

  const handleEditorClose = () => {
    editorVisible = false;
    author = newAuthor();
    editorErrors = undefined;
  };

  const handleEditorSave = async () => {
    editorBusy = true;
    try {
      await trpc.mutation('authors:save', author);
      editorVisible = false;
      author = newAuthor();
      reloadAuthors();
    } catch (err) {
      editorErrors = getEditorErrors(err);
    }
    editorBusy = false;
  };
</script>

<svelte:head>
  <title>Authors • Bookstall</title>
</svelte:head>

<DataTable
  {loading}
  title="Authors"
  filterDescription="first or last name"
  items={authors}
  key="id"
  columns={[
    { title: 'First name', prop: 'firstName' },
    { title: 'Last name', prop: 'lastName' },
    { title: 'Books', textAlign: 'right', render: (author) => author._count.books }
  ]}
  on:filter={handleFilter}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  title={author.id ? `${author.firstName} ${author.lastName}` : 'New author'}
  visible={editorVisible}
  busy={editorBusy}
  on:close={handleEditorClose}
  on:save={handleEditorSave}
>
  <div class="grid">
    <TextInput
      label="First name"
      required
      bind:value={author.firstName}
      error={editorErrors?.firstName}
    />
    <TextInput
      label="Last name"
      required
      bind:value={author.lastName}
      error={editorErrors?.lastName}
    />
  </div>
  <TextareaInput label="Bio" bind:value={author.bio} error={editorErrors?.bio} />
</ModalEditor>
