<script>
  import CloseButton from "../CloseButton"

  let { config, record, viewState } = $props()
</script>

<tr class="rs-view rs-show">
  <td colspan={config.fields.length + 1}>
    <CloseButton action={() => (viewState = null)} />
    <span class="rs-view-title">Show {config.recordTitle}</span>
    <dl style="margin: 0">
      {#each config.showFields as f}
        <dt>{config.fieldConfig[f].label}</dt>
        <dd>{@html config._renderShow(f, record)}</dd>
      {/each}
    </dl>
  </td>
</tr>

<style>
  tr {
    border-top: none;
  }

  dt {
    font-weight: bold;
  }
  dd {
    margin-left: 1em;
    margin-bottom: 0.5em;
  }
</style>
