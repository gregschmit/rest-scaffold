<script>
  import { onMount } from "svelte"
  import Config from "./config/index"

  import Spinner from "./components/Spinner"
  import Scaffold from "./components/Scaffold"
  import Alert from "./components/Alert"

  export let args

  let config = new Config(args)
  let data

  let loadError

  let processing = false
  let page = config.pagination.initialPage || null
  let pageSize = config.pagination.initialPageSize || null

  config.reload = () => {
    config = config
  }

  config.refresh = async (opts = {}) => {
    if (!opts.auto) {
      processing = true
    }

    if (opts.page) {
      page = opts.page
    }

    if (opts.pageSize) {
      pageSize = opts.pageSize
    }

    let result
    if (data) {
      result = await config.api.list({ page, pageSize })
    } else {
      result = await config.api.initialize()
    }
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
    let result = await config.initialize()

    if (typeof result === "string") {
      loadError = result
      config.autoRefresh()
    } else {
      data = result
      config.autoRefresh()
    }
  })
</script>

<div
  class="rest-scaffold-main"
  style="
    --rs-bg: {config.theme.bg};
    --rs-fg: {config.theme.fg};
    --rs-primary: {config.theme.primary};
    --rs-primary-hover: {config.theme.primaryHover};
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
    <Scaffold {config} {data} {processing} />
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
    font-size: 0.8em;
  }

  .rest-scaffold-main :global(a) {
    text-decoration: none;
    color: var(--rs-primary);
  }

  .rest-scaffold-main :global(a:hover) {
    color: var(--rs-primary-hover);
  }
</style>
