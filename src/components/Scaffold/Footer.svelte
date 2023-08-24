<script>
  import PageLink from "./Footer/PageLink.svelte"

  export let config
  export let data
</script>

<div class="rest-scaffold-footer">
  <span>
    Found {data.results?.length}
    {#if data.pagination}
      of {data.pagination.count}
    {/if}
  </span>
  <span>
    {#if data.pagination}
      {#if data.pagination.display.startWindow?.length}
        {#each data.pagination.display.startWindow as i}
          <PageLink {config} {i} />
        {/each}
        ...
      {/if}
      {#each data.pagination.display.beforeWindow as i}
        <PageLink {config} {i} />
      {/each}
      {data.pagination.page}
      {#each data.pagination.display.afterWindow as i}
        <PageLink {config} {i} />
      {/each}
      {#if data.pagination.display.endWindow?.length}
        ...
        {#each data.pagination.display.endWindow as i}
          <PageLink {config} {i} />
        {/each}
      {/if}
    {/if}
  </span>
</div>

<style>
  .rest-scaffold-footer {
    display: flex;
    justify-content: space-between;

    margin: 0;
    padding: 0;
    width: 100%;

    font-weight: bold;
  }
</style>
