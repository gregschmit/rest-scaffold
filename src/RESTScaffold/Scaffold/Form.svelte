<script>
  import Alert from "../Alert.svelte"
  import FieldGroup from "./Form/FieldGroup.svelte"

  let { config, viewState, record = null } = $props()
  let errors = $state({})
  let apiError = $state(null)

  // let topErrorMessage = eff

  const fields = record ? config.updateFields : config.createFields

  async function create(event) {
    event.preventDefault()

    const { payload, error } = await config.api.create(config.getFormJSON(event.target))

    if (error) {
      if (payload.errors) {
        errors = payload.errors
      }

      apiError = error
    } else {
      errors = {}
      apiError = null
      config.refresh()
      viewState = null
    }
  }

  async function update(event) {
    event.preventDefault()
    await onsubmit(config.getFormJSON(event.target), record.id)
  }
</script>

<form onsubmit={record ? update : create}>
  {#if apiError || errors[config.nonFieldErrorsKey]}
    <Alert
      type="error"
      message={apiError && errors[config.nonFieldErrorsKey]
        ? apiError + ": " + errors[config.nonFieldErrorsKey]
        : apiError || errors[config.nonFieldErrorsKey]}
    />
  {/if}

  <FieldGroup {config} {fields} {record} {errors} />

  <input
    type="submit"
    class="rs-button rs-button-large rs-button-primary"
    value={record ? "Update" : "Create"}
  />
  <button class="rs-button rs-button-large" onclick={() => (viewState = null)}>Cancel</button>
</form>

<style>
</style>
