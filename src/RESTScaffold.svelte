<script>
  import { onMount } from "svelte"
  import Config from "./config/index"

  import Spinner from "./components/Spinner"
  import Scaffold from "./components/Scaffold"
  import Alert from "./components/Alert"

  export let args

  let config = new Config(args)
  let initializationError
  let data

  let refreshing = false
  let page = config.pagination.initialPage || null
  let pageSize = config.pagination.initialPageSize || null

  config.reload = () => {
    config = config
  }

  config.refresh = async (opts = {}) => {
    if (!opts.auto) {
      refreshing = true
    }

    if (opts.page) {
      page = opts.page
    }

    if (opts.pageSize) {
      pageSize = opts.pageSize
    }

    data = await config.api.list({ page, pageSize })

    if (true || !opts.auto) {
      refreshing = false
    }
  }

  config.autoRefresh = () => {
    if (config.autoRefreshSeconds && config.refresh) {
      setTimeout(async () => {
        if (!config.autoRefreshLock.size) {
          await config.refresh({ auto: true })
        }
        config.autoRefresh()
      }, config.autoRefreshSeconds * 1000)
    }
  }

  onMount(async () => {
    data = await config.initialize()

    if (typeof data === "string") {
      initializationError = data
    } else {
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
  {#if initializationError}
    <Alert type="error" message={initializationError} />
  {:else if data}
    <Scaffold {config} {data} {refreshing} />
  {:else}
    <Spinner size="3em" />
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
