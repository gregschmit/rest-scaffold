<script>
  import Header from "./Scaffold/Header"
  import Footer from "./Scaffold/Footer"
  import Row from "./Scaffold/Row"

  let { config, data, processing, sort } = $props()
</script>

<Header {config} {processing} />
<div class="rs-table-wrapper">
  <table>
    <thead>
      <tr>
        {#each config.listFields as f}
          {#if config.fieldConfig[f].sortable}
            <th class="rs-sortable" onclick={() => config.refresh({ sort: f })}>
              <span class="rs-table-header">{config.fieldConfig[f].label}</span>
              <span
                class="rs-sort"
                class:rs-sort-asc={f in sort.parts && sort.parts[f]}
                class:rs-sort-desc={f in sort.parts && !sort.parts[f]}
              ></span>
            </th>
          {:else}
            <th>
              <span class="rs-table-header">{config.fieldConfig[f].label}</span>
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
  .rs-table-wrapper {
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

  .rs-sortable {
    position: relative;

    .rs-table-header {
      margin-right: 1em;
    }

    .rs-sort {
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

      &.rs-sort-asc::before {
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

      &.rs-sort-desc::after {
        opacity: 1;
      }
    }
  }
</style>
