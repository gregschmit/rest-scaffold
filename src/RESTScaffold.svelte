<script>
  import { onMount } from "svelte"
  import Config from "./config/index"

  import Spinner from "./components/Spinner"
  import Scaffold from "./components/Scaffold"
  import Alert from "./components/Alert"

  class Order {
    string
    parts

    constructor(s) {
      this.fromString(s)
    }

    fromString(s) {
      this.string = s
      this.parts = {}

      for (let part of s.split(",")) {
        if (!part) {
          continue
        }

        let desc = part.startsWith("-")
        if (desc) {
          part = part.slice(1)
        }
        this.parts[part] = !desc
      }
    }

    fromParts(p) {
      this.parts = p
      this.string = Object.keys(p)
        .filter(Boolean)
        .map((k) => `${p[k] ? "" : "-"}${k}`)
        .join(",")
    }

    addOrder(field, asc) {
      this.parts[field] = asc
      this.fromParts(this.parts)
    }

    removeOrder(field) {
      delete this.parts[field]
      this.fromParts(this.parts)
    }
  }

  export let args

  let config = new Config(args)
  let data = null

  let loadError

  let processing = false
  let order = new Order("")
  let page = config.pagination.initialPage || null
  let pageSize = config.pagination.initialPageSize || null

  config.reload = () => {
    config = config
  }

  config.refresh = async (opts = {}) => {
    if (!opts.auto) {
      processing = true
    }

    if (opts.delete) {
      await config.api.delete(opts.delete)
    }

    if (opts.order) {
      if (opts.order in order.parts) {
        if (order.parts[opts.order]) {
          order.addOrder(opts.order, false)
        } else {
          order.removeOrder(opts.order)
        }
      } else {
        order.addOrder(opts.order, true)
      }

      order = order
    }

    if (opts.page) {
      page = opts.page
    }

    if (opts.pageSize) {
      pageSize = opts.pageSize
    }

    // If we're initializing, we need to pass that to the list method.
    let listOpts = { init: data === null, order: order.string, page, pageSize }
    let result = await config.api.list(listOpts)
    if (typeof result === "string") {
      loadError = result
    } else {
      loadError = null
      data = result
    }

    processing = false
  }

  config.autoRefresh = () => {
    if (config.autoRefreshSeconds && config.refresh) {
      setTimeout(async () => {
        await config.refresh({ auto: true })
        config.autoRefresh()
      }, config.autoRefreshSeconds * 1000)
    }
  }

  onMount(async () => {
    await config.refresh()
    config.autoRefresh()
  })
</script>

<div
  class="rest-scaffold-main"
  style="
    --rs-font-size: {config.fontSize};
    --rs-bg: {config.theme.bg};
    --rs-fg: {config.theme.fg};
    --rs-primary: {config.theme.primary};
    --rs-link: {config.theme.link};
    --rs-link-hover: {config.theme.linkHover};
    --rs-table-header-bg: {config.theme.tableHeaderBg};
    --rs-table-border-h: {config.theme.tableBorderH};
    --rs-table-border-v: {config.theme.tableBorderV};
    --rs-alert-info-bg: {config.theme.alertInfoBg};
    --rs-alert-info-fg: {config.theme.alertInfoFg};
    --rs-alert-warning-bg: {config.theme.alertWarningBg};
    --rs-alert-warning-fg: {config.theme.alertWarningFg};
    --rs-alert-error-bg: {config.theme.alertErrorBg};
    --rs-alert-error-fg: {config.theme.alertErrorFg};
  "
>
  {#if loadError}
    <Alert type="error" message={loadError} />
  {/if}

  {#if data}
    <Scaffold {config} {data} {processing} {order} />
  {:else if !loadError}
    <div style="text-align: center">
      <Spinner size="3em" />
    </div>
  {/if}
</div>

<style>
  .rest-scaffold-main {
    margin: 0;
    padding: 0.5em 0.3em;
    width: 100%;
    box-sizing: border-box;

    background-color: var(--rs-bg);
    color: var(--rs-fg);

    font-family: sans-serif;
    font-size: var(--rs-font-size);
  }

  .rest-scaffold-main :global(a) {
    color: var(--rs-link);
    text-decoration: none;
  }

  .rest-scaffold-main :global(a:hover) {
    color: var(--rs-link-hover);
    text-decoration: underline;
  }

  :global(button.rest-scaffold-link-button) {
    color: var(--rs-link);
    cursor: pointer;

    background: none;
    border: none;
    font-family: sans-serif;
    font-size: inherit;
    font-weight: bold;
    padding: 0 0.25em;
  }

  :global(button.rest-scaffold-link-button:hover) {
    color: var(--rs-link-hover);
  }
</style>
