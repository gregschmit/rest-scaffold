<script>
  import Header from "./Scaffold/Header.svelte"
  import Footer from "./Scaffold/Footer.svelte"

  export let config
  export let data
  export let processing
  export let order
</script>

<Header {config} {processing} />
<div class="rest-scaffold-table-wrapper">
  <table>
    <thead>
      <tr>
        {#each config.fields as f}
          <th on:click={() => config.refresh({ order: f })}>
            <span class="rest-scaffold-table-header">{config.fieldConfig[f].label}</span>
            {#if f in order.parts}
              {#if order.parts[f]}
                <span class="rest-scaffold-arrow rest-scaffold-arrow-up">▲</span>
              {:else}
                <span class="rest-scaffold-arrow rest-scaffold-arrow-down">▼</span>
              {/if}
            {:else}
              <span class="rest-scaffold-arrow rest-scaffold-arrow-placeholder">▲</span>
            {/if}
          </th>
        {/each}
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each data.results as record, i}
        <tr>
          {#each config.fields as f}
            <td>{record[f]}</td>
          {/each}
          <td>
            <button
              on:click={() => {
                if (confirm("Are you sure you want to delete this record?")) {
                  config.refresh({ delete: record })
                }
              }}
              class="rest-scaffold-link-button"
            >
              Delete
            </button>
            <!-- <button on:click={() => config.edit(record)} class="rest-scaffold-link-button">
              Edit
            </button>
            <button on:click={() => config.view(record)} class="rest-scaffold-link-button">
              Show
            </button> -->
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<Footer {config} {data} />

<style>
  .rest-scaffold-table-wrapper {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: auto;
  }

  table {
    border: 0;
    border-collapse: collapse;
    box-sizing: border-box;

    padding: 0.8em;
    min-width: 100%;
  }
  th {
    background-color: var(--rs-table-header-bg);
    user-select: none;

    & .rest-scaffold-table-header {
      user-select: text;
    }
  }
  td,
  th {
    padding: 0.25em;
    text-align: left;
  }
  tbody tr + tr {
    border-top: 0.1em solid var(--rs-table-border-h);
  }
  td + td {
    border-left: 0.1em solid var(--rs-table-border-v);
  }

  /* Ensure first and last columns are not wrapped. */
  table tr > td:first-child,
  table tr > td:last-child {
    word-wrap: normal;
    word-break: normal;
    white-space: nowrap;
  }

  /* Last column should be right-aligned. */
  table tr > td:last-child {
    text-align: right;
  }

  .rest-scaffold-arrow {
    font-size: 0.7em;
    transform: scale(1.5, 1);
    opacity: 0.5;
    padding-top: 0.2em;
    float: right;
  }
  .rest-scaffold-arrow-placeholder {
    opacity: 0;
  }
</style>
