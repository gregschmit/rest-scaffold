<script>
  import Show from "./Row/Show"

  let { config, record, i } = $props()

  let viewState = $state(null)
</script>

<tr class="rs-record" class:rs-even={i % 2}>
  {#each config.listFields as f}
    <td>{@html config._render(f, record)}</td>
  {/each}
  <td>
    {#if config.canShow}
      <button onclick={() => (viewState = "show")} class="rs-link-button">Show</button>
    {/if}
    <!-- <button on:click={() => config.edit(record)} class="rs-link-button">
      Edit
    </button> -->
    {#if config.canDelete}
      <button
        onclick={() => {
          if (confirm("Are you sure you want to delete this record?")) {
            config.refresh({ delete: record })
          }
        }}
        class="rs-link-button rs-link-danger"
      >
        Delete
      </button>
    {/if}
  </td>
</tr>

{#if viewState === "show"}
  <Show {config} {record} bind:viewState />
{/if}

<style>
  tr.rs-even {
    background-color: light-dark(var(--rs-light-table-striped-bg), var(--rs-dark-table-striped-bg));
  }
  td + td {
    border-left: 0.1em solid
      light-dark(var(--rs-light-table-border-v), var(--rs-dark-table-border-v));
  }

  /* Ensure first and last columns are not wrapped. */
  tr.rs-record > td:first-child,
  tr.rs-record > td:last-child {
    word-wrap: normal;
    word-break: normal;
    white-space: nowrap;
  }

  /* Last column should be right-aligned. */
  tr.rs-record > td:last-child {
    text-align: right;
  }
</style>
