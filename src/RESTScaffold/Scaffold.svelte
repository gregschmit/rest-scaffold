<script>
  import Header from "./Scaffold/Header"
  import Footer from "./Scaffold/Footer"
  import Row from "./Scaffold/Row"

  let { config, data, processing, sort } = $props()
</script>

<Header {config} {processing} />
<div class="rest-scaffold-table-wrapper">
  <table>
    <thead>
      <tr>
        {#each config.fields as f}
          {#if config.fieldConfig[f].sortable}
            <th class="rest-scaffold-sortable" onclick={() => config.refresh({ sort: f })}>
              <span class="rest-scaffold-table-header">{config.fieldConfig[f].label}</span>
              <span
                class="rest-scaffold-sort"
                class:rest-scaffold-sort-asc={f in sort.parts && sort.parts[f]}
                class:rest-scaffold-sort-desc={f in sort.parts && !sort.parts[f]}
              ></span>
            </th>
          {:else}
            <th>
              <span class="rest-scaffold-table-header">{config.fieldConfig[f].label}</span>
            </th>
          {/if}
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
    padding: 0.4em;
    text-align: left;
  }

  :global(td) {
    padding: 0.3em;
    text-align: left;
  }

  :global(tr + tr) {
    border-top: 0.1em solid
      light-dark(var(--rs-light-table-border-h), var(--rs-dark-table-border-h));
  }

  .rest-scaffold-sortable {
    position: relative;

    .rest-scaffold-table-header {
      margin-right: 1em;
    }

    .rest-scaffold-sort {
      position: absolute;
      right: 0.7em;
      top: 0;
      bottom: 0;
      width: 0.7em;
      font-size: 0.7em;
      font-weight: bold;

      &::before {
        content: "▲";
        color: light-dark(black, white);
        line-height: 1em;
        opacity: 0.2;
        position: absolute;
        left: 0;
        display: block;
        bottom: 50%;
      }

      &.rest-scaffold-sort-asc::before {
        opacity: 1;
      }

      &::after {
        content: "▼";
        color: light-dark(black, white);
        line-height: 1em;
        opacity: 0.2;
        position: absolute;
        left: 0;
        display: block;
        top: 50%;
      }

      &.rest-scaffold-sort-desc::after {
        opacity: 1;
      }
    }
  }
</style>
