<script>
  let { config, record, viewState } = $props()
</script>

<tr class="rest-scaffold-member-view rest-scaffold-show">
  <td colspan={config.fields.length + 1}>
    <div>
      <button
        onclick={() => (viewState = null)}
        class="rest-scaffold-link-button"
        style="float: right"
      >
        Close
      </button>
      <div>
        {#each config.fields as f}
          <div>
            <span>{config.fieldConfig[f].label}</span>
            <span>{record[f]}</span>
          </div>
        {/each}
      </div>
    </div>
  </td>
</tr>

<style>
  tr.rest-scaffold-member-view {
    border-top: none;
  }
</style>
