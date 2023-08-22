<script>
  import { onMount } from "svelte"

  const VALID_TYPES = ["info", "warning", "error"]
  const DEFAULT_COLORS = {
    info: { bg: "#cff4fc", fg: "#055160" },
    warning: { bg: "#fff3cd", fg: "#664d03" },
    error: { bg: "#f8d7da", fg: "#58151c" },
  }

  export let type = "info"
  export let message
  export let dismiss
  export let dismissAfter
  export let colors

  colors = { ...DEFAULT_COLORS, ...colors }

  if (!VALID_TYPES.includes(type)) {
    type = "info"
  }

  onMount(() => {
    if (dismiss && dismissAfter) {
      setTimeout(dismiss, dismissAfter)
    }
  })
</script>

<div
  class="rs-alert rs-alert-{type}"
  style="--info-bg: {colors.info.bg}; --info-fg: {colors.info.fg};
    --warning-bg: {colors.warning.bg}; --warning-fg: {colors.warning.fg};
    --error-bg: {colors.error.bg}; --error-fg: {colors.error.fg};"
>
  <div>
    {#if dismiss}
      <button on:click={dismiss} />
    {/if}
    <span>{message}</span>
  </div>

  {#if $$slots["default"]}
    <slot />
  {/if}
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

  .rs-alert-info {
    background-color: var(--info-bg);
    border-color: var(--info-fg);
    color: var(--info-fg);
  }
  .rs-alert-warning {
    background-color: var(--warning-bg);
    border-color: var(--warning-fg);
    color: var(--warning-fg);
  }
  .rs-alert-error {
    background-color: var(--error-bg);
    border-color: var(--error-fg);
    color: var(--error-fg);
  }
</style>
