<script>
  import { onMount } from "svelte"

  const VALID_TYPES = ["success", "info", "warning", "error"]

  let { type = "info", message, dismiss, dismissAfter } = $props()

  if (!VALID_TYPES.includes(type)) {
    type = "info"
  }

  onMount(() => {
    if (dismiss && dismissAfter) {
      setTimeout(dismiss, dismissAfter)
    }
  })
</script>

<div class="rs-alert rs-{type}">
  <div>
    {#if dismiss}
      <button onclick={dismiss} aria-label="Close"></button>
    {/if}
    <span>{message}</span>
  </div>
</div>

<style>
  .rs-alert {
    margin: 0;
    padding: 0.2em;
    width: 100%;

    box-sizing: border-box;
    border: 0.1em solid;
    border-left: 0.5em solid;
  }
  .rs-alert div:first-child {
    position: relative;

    margin: 0;
    padding: 0;
    width: 100%;
  }
  .rs-alert div:first-child span {
    font-weight: bold;
  }
  .rs-alert div:first-child button {
    float: right;

    margin: 0;
    padding: 0;
    width: 1.2em;
    height: 1.2em;

    color: black;
    opacity: 0.5;

    background: transparent
      url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 20 20' fill='%23000'><path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/></svg>")
      center/1.2em auto no-repeat;
    box-shadow: none;
    border: none;
  }
  .rs-alert div:first-child button:hover {
    opacity: 0.9;
  }

  .rs-success {
    background-color: light-dark(var(--rs-light-success-bg), var(--rs-dark-success-bg));
    border-color: light-dark(var(--rs-light-success-fg), var(--rs-dark-success-fg));
    color: light-dark(var(--rs-light-success-fg), var(--rs-dark-success-fg));
  }
  .rs-info {
    background-color: light-dark(var(--rs-light-info-bg), var(--rs-dark-info-bg));
    border-color: light-dark(var(--rs-light-info-fg), var(--rs-dark-info-fg));
    color: light-dark(var(--rs-light-info-fg), var(--rs-dark-info-fg));
  }
  .rs-warning {
    background-color: light-dark(var(--rs-light-warning-bg), var(--rs-dark-warning-bg));
    border-color: light-dark(var(--rs-light-warning-fg), var(--rs-dark-warning-fg));
    color: light-dark(var(--rs-light-warning-fg), var(--rs-dark-warning-fg));
  }
  .rs-error {
    background-color: light-dark(var(--rs-light-error-bg), var(--rs-dark-error-bg));
    border-color: light-dark(var(--rs-light-error-fg), var(--rs-dark-error-fg));
    color: light-dark(var(--rs-light-error-fg), var(--rs-dark-error-fg));
  }
</style>
