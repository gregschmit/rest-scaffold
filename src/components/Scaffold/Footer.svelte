<script>
  export let config
</script>

<div class="rest-scaffold-footer">
  <span>
    {config.data.results?.length}
    {#if config.data.pagination}
      of {config.data.pagination.count}
    {/if}
  </span>
  <span>
    {#if config.data.pagination}
      {#if config.data.pagination.page > 1}
        <button>Prev</button>
      {/if}
      {config.data.pagination.page}
      {#if config.data.pagination.page < config.data.pagination.totalPages}
        <button>Next</button>
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
  }
</style>
