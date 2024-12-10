<script>
  import CloseButton from "../CloseButton"

  let { config, record, viewState } = $props()
</script>

<tr class="rest-scaffold-view rest-scaffold-show">
  <td colspan={config.fields.length + 1}>
    <div>
      <CloseButton action={() => (viewState = null)} />
      <dl style="margin: 0">
        {#each config.fields as f}
          <dt>{config.fieldConfig[f].label}</dt>
          <dd>{@html config.renderDetail(record, f)}</dd>
        {/each}
      </dl>
    </div>
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
