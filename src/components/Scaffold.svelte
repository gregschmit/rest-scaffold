<script>
  import Header from "./Scaffold/Header"
  import Footer from "./Scaffold/Footer"
  import Row from "./Scaffold/Row"

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
      {#each data.results as record, i (record.id)}
        <Row {config} {record} {i} />
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
    background-color: light-dark(var(--rs-light-table-header-bg), var(--rs-dark-table-header-bg));
    user-select: none;
  }
  th {
    padding: 0.25em;
    text-align: left;
  }

  th,
  :global(td) {
    padding: 0.25em;
    text-align: left;
  }

  :global(tr + tr) {
    border-top: 0.1em solid
      light-dark(var(--rs-light-table-border-h), var(--rs-dark-table-border-h));
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
