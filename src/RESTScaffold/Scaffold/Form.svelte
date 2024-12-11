<script>
  import FieldGroup from "./Form/FieldGroup.svelte"

  let { config, viewState, record = null } = $props()

  const fields = record ? config.updateFields : config.createFields

  function submit(event) {
    event.preventDefault()

    const data = Object.fromEntries(new FormData(event.target).entries())

    // Parse booleans.
    Array.from(event.target.querySelectorAll('input[type="checkbox"]')).forEach((el) => {
      data[el.name] = el.checked
    })

    // Parse numbners.
    Array.from(event.target.querySelectorAll('input[type="number"]')).forEach((el) => {
      // Test if `data-rs-type` is set to `integer`, `float`, `decimal`, or other (`number`).
      if (el.getAttribute("data-rs-type") === "integer") {
        data[el.name] = parseInt(data[el.name])
      } else if (el.getAttribute("data-rs-type") === "float") {
        data[el.name] = parseFloat(data[el.name])
      } else if (el.getAttribute("data-rs-type") === "decimal") {
        // String is the proper type for decimal numbers.
      } else {
        data[el.name] = Number(data[el.name])
      }
    })

    // Remove hidden inputs.
    Array.from(event.target.querySelectorAll(".rs-input-hidden")).forEach((el) => {
      delete data[el.name]
    })

    console.log(data)
  }
</script>

<form onsubmit={submit}>
  <FieldGroup {config} {fields} {record} />

  <input
    type="submit"
    class="rs-button rs-button-large rs-button-primary"
    value={record ? "Update" : "Create"}
  />
  <button class="rs-button rs-button-large" onclick={() => (viewState = null)}>Cancel</button>
</form>

<style>
</style>
