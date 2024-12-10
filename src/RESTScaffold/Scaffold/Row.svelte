<script>
  import Show from "./Row/Show"

  let { config, record, i } = $props()

  let viewState = $state(null)
</script>

<tr class="rest-scaffold-record" class:rest-scaffold-even={i % 2}>
  {#each config.fields as f}
    <td>{@html config.render(record, f)}</td>
  {/each}
  <td>
    {#if config.canShow}
      <button onclick={() => (viewState = "show")} class="rest-scaffold-link-button">Show</button>
    {/if}
    <!-- <button on:click={() => config.edit(record)} class="rest-scaffold-link-button">
      Edit
    </button> -->
    {#if config.canDelete}
      <button
        onclick={() => {
          if (confirm("Are you sure you want to delete this record?")) {
            config.refresh({ delete: record })
          }
        }}
        class="rest-scaffold-link-button rest-scaffold-danger"
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
  tr.rest-scaffold-even {
    background-color: light-dark(var(--rs-light-table-striped-bg), var(--rs-dark-table-striped-bg));
  }
  td + td {
    border-left: 0.1em solid
      light-dark(var(--rs-light-table-border-v), var(--rs-dark-table-border-v));
  }

  /* Ensure first and last columns are not wrapped. */
  tr.rest-scaffold-record > td:first-child,
  tr.rest-scaffold-record > td:last-child {
    word-wrap: normal;
    word-break: normal;
    white-space: nowrap;
  }

  /* Last column should be right-aligned. */
  tr.rest-scaffold-record > td:last-child {
    text-align: right;
  }
</style>
