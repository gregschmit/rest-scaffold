<script>
  const VALID_TYPES = ["info", "warning", "error"]
  const DEFAULT_COLORS = {
    info: { bg: "#cff4fc", fg: "#055160" },
    warning: { bg: "#fff3cd", fg: "#664d03" },
    error: { bg: "#f8d7da", fg: "#58151c" },
  }

  export let type = "info"
  export let message
  export let dismiss = () => {
    console.log("dismiss")
  }
  export let colors

  colors = { ...DEFAULT_COLORS, ...colors }

  if (!VALID_TYPES.includes(type)) {
    type = "info"
  }
</script>

<div
  class="rs-alert rs-alert-{type}"
  style="--info-bg: {colors.info.bg}; --info-fg: {colors.info.fg};
    --warning-bg: {colors.warning.bg}; --warning-fg: {colors.warning.fg};
    --error-bg: {colors.error.bg}; --error-fg: {colors.error.fg};"
>
  <div>
    <span>{message}</span>
    {#if dismiss}
      <div><button on:click={dismiss}>&#x2715</button></div>
    {/if}
  </div>

  {#if $$slots["default"]}
    <slot />
  {/if}
</div>

<style>
  .rs-alert {
    width: 100%;
    margin: 0;
    padding: 0.2em;

    box-sizing: border-box;
    border: 0.1em solid;
    border-left: 0.5em solid;
  }
  .rs-alert div:first-child {
    /* This makes `margin-left` work on the close button `div`. */
    display: flex;

    width: 100%;
    margin: 0;
    padding: 0;
  }
  .rs-alert div:first-child span {
    display: flex;
    align-items: center;

    margin: 0;
    padding: 0;

    font-weight: bold;
  }
  .rs-alert div:first-child div {
    margin: 0;
    margin-left: auto;
    padding: 0;
  }
  .rs-alert div:first-child div button {
    margin: 0;
    padding: 0;
    width: 1.2em;
    height: 1.2em;

    font-size: 1.3em;

    background: none;
    box-shadow: none;
    border-radius: 0;
    border: 0;
    background-color: #9b0b15;
    color: white;
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
