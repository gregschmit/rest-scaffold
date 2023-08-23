<script>
  import Header from "./Scaffold/Header.svelte"
  import Footer from "./Scaffold/Footer.svelte"

  export let config
</script>

<Header {config} />
<table>
  <thead>
    <tr>
      {#each config.fields as f}
        <th>{f}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each config.data.results as record, i}
      <tr>
        {#each config.fields as f}
          <td>{record[f]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
<Footer {config} />

<style>
  table {
    border: 0;
    border-collapse: collapse;
    box-sizing: border-box;

    padding: 0.8em;
    min-width: 100%;
  }

  td,
  th {
    padding: 0.25em;
  }
  tbody,
  tbody tr + tr {
    border-top: 0.1em solid #aeaeae;
  }
  th + th,
  td + td {
    border-left: 0.1em solid #d6d6d6;
  }

  /* Ensure first and last columns are not wrapped. */
  table tr > td:first-child,
  table tr > td:last-child {
    word-wrap: normal;
    word-break: normal;
    white-space: nowrap;
  }
</style>
