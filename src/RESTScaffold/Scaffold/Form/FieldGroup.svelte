<script>
  let { config, fields, record = null, groupName = null } = $props()
</script>

<div class:rs-form-subgroup={groupName}>
  {#if groupName}
    <span class="rs-form-group-name">{groupName}</span>
  {/if}

  {#each fields as f}
    {#if config.isObject(f)}
      {#each Object.keys(f) as subGroupName}
        <FieldGroup {config} fields={f[subGroupName]} {record} groupName={subGroupName} />
      {/each}
    {:else if !config.fieldConfig[f].readonly}
      {@html config._renderInput(f, { record })}
    {/if}
  {/each}
</div>

<style>
  .rs-form-subgroup {
    margin: 0 1em;
  }

  .rs-form-group-name {
    font-size: 1em;
    font-weight: bold;
    margin: 0.5em 0 0.3em 0;
  }
</style>
