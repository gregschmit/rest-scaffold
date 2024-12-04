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
  let order = new Order(config.initialOrder || "")
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

  export function getConfig() {
    return config
  }
</script>

<div
  class="rest-scaffold"
  style="
    --rs-font-size: {config.theme.fontSize};
    --rs-light-bg: {config.theme.light.bg};
    --rs-light-fg: {config.theme.light.fg};
    --rs-light-primary: {config.theme.light.primary};
    --rs-light-link: {config.theme.light.link};
    --rs-light-link-hover: {config.theme.light.linkHover};
    --rs-light-table-header-bg: {config.theme.light.tableHeaderBg};
    --rs-light-table-border-h: {config.theme.light.tableBorderH};
    --rs-light-table-border-v: {config.theme.light.tableBorderV};
    --rs-light-table-striped-bg: {config.theme.light.tableStripedBg};
    --rs-light-alert-info-bg: {config.theme.light.alertInfoBg};
    --rs-light-alert-info-fg: {config.theme.light.alertInfoFg};
    --rs-light-alert-warning-bg: {config.theme.light.alertWarningBg};
    --rs-light-alert-warning-fg: {config.theme.light.alertWarningFg};
    --rs-light-alert-error-bg: {config.theme.light.alertErrorBg};
    --rs-light-alert-error-fg: {config.theme.light.alertErrorFg};
    --rs-dark-bg: {config.theme.dark.bg};
    --rs-dark-fg: {config.theme.dark.fg};
    --rs-dark-primary: {config.theme.dark.primary};
    --rs-dark-link: {config.theme.dark.link};
    --rs-dark-link-hover: {config.theme.dark.linkHover};
    --rs-dark-table-header-bg: {config.theme.dark.tableHeaderBg};
    --rs-dark-table-border-h: {config.theme.dark.tableBorderH};
    --rs-dark-table-border-v: {config.theme.dark.tableBorderV};
    --rs-dark-table-striped-bg: {config.theme.dark.tableStripedBg};
    --rs-dark-alert-info-bg: {config.theme.dark.alertInfoBg};
    --rs-dark-alert-info-fg: {config.theme.dark.alertInfoFg};
    --rs-dark-alert-warning-bg: {config.theme.dark.alertWarningBg};
    --rs-dark-alert-warning-fg: {config.theme.dark.alertWarningFg};
    --rs-dark-alert-error-bg: {config.theme.dark.alertErrorBg};
    --rs-dark-alert-error-fg: {config.theme.dark.alertErrorFg};
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
  .rest-scaffold {
    margin: 0;
    padding: 0.5em 0.3em;
    width: 100%;
    box-sizing: border-box;

    background-color: light-dark(var(--rs-light-bg), var(--rs-dark-bg));
    color: light-dark(var(--rs-light-fg), var(--rs-dark-fg));

    font-family: sans-serif;
    font-size: var(--rs-font-size);
  }

  .rest-scaffold :global(a) {
    color: light-dark(var(--rs-light-link), var(--rs-dark-link));
    text-decoration: none;
  }

  .rest-scaffold :global(a:hover) {
    color: light-dark(var(--rs-light-link-hover), var(--rs-dark-link-hover));
    text-decoration: underline;
  }

  .rest-scaffold :global(button.rest-scaffold-link-button) {
    color: light-dark(var(--rs-light-link), var(--rs-dark-link));
    cursor: pointer;

    background: none;
    border: none;
    font-family: sans-serif;
    font-size: inherit;
    font-weight: bold;
    padding: 0 0.25em;
  }

  .rest-scaffold :global(button.rest-scaffold-link-button:hover) {
    color: light-dark(var(--rs-light-link-hover), var(--rs-dark-link-hover));
  }
</style>
