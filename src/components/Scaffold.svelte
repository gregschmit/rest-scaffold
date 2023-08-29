<script>
  import Header from "./Scaffold/Header.svelte"
  import Footer from "./Scaffold/Footer.svelte"

  export let config
  export let data
  export let refreshing
</script>

<Header {config} {refreshing} />
<div class="rest-scaffold-table-wrapper">
  <table>
    <thead>
      <tr>
        {#each config.fields as f}
          <th>{f}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data.results as record, i}
        <tr>
          {#each config.fields as f}
            <td>{record[f]}</td>
          {/each}
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
</style>
