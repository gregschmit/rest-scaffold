<script>
  import PageLink from "./Footer/PageLink.svelte"

  export let config
  export let data

  let pageSize = config.pagination.initialPageSize
</script>

<div class="rest-scaffold-footer">
  <span>
    {data.results?.length}
    {#if data.pagination}
      of {data.pagination.count}
    {/if} Total
  </span>
  <span>
    {#if data.pagination && data.pagination.display}
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

    {#if config.pagination.pageSize?.length > 1}
      <span class="rest-scaffold-pagination-select-wrapper">
        <select
          bind:value={pageSize}
          on:change={() => config.refresh({ page: 1, pageSize })}
          style="font-size: inherit"
        >
          {#each config.pagination.pageSize as i}
            <option value={i}>{i}</option>
          {/each}
        </select>
        <span>per Page</span>
      </span>
    {/if}
  </span>
</div>

<style>
  .rest-scaffold-footer {
    display: flex;
    justify-content: space-between;

    margin: 0;
    padding: 0.2em;
    width: 100%;
    box-sizing: border-box;

    font-weight: bold;
  }

  .rest-scaffold-pagination-select-wrapper {
    font-weight: normal;
  }
</style>
