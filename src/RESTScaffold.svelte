<script>
  import { onMount } from "svelte"
  import Config from "./config/index"

  import Spinner from "./RESTScaffold/Spinner"
  import Scaffold from "./RESTScaffold/Scaffold"
  import Alert from "./RESTScaffold/Alert"

  class Sort {
    string = $state(null)
    parts = $state(null)

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

    addSort(field, asc) {
      this.parts[field] = asc
      this.fromParts(this.parts)
    }

    removeSort(field) {
      delete this.parts[field]
      this.fromParts(this.parts)
    }
  }

  let { args } = $props()

  let config = new Config(args)
  let data = $state(null)

  let loadError = $state(null)

  let processing = $state(false)
  let sort = $state(new Sort(config.initialSort || ""))
  let page = $state(config.pagination.initialPage || null)
  let pageSize = $state(config.pagination.pageSize?.[0])

  config.refresh = async (opts = {}) => {
    if (!opts.auto) {
      processing = true
    }

    if (opts.delete) {
      await config.api.delete(opts.delete)
    }

    if (opts.sort) {
      if (opts.sort in sort.parts) {
        if (sort.parts[opts.sort]) {
          sort.addSort(opts.sort, false)
        } else {
          sort.removeSort(opts.sort)
        }
      } else {
        sort.addSort(opts.sort, true)
      }

      sort = sort
    }

    if (opts.page) {
      page = opts.page
    }

    if (opts.pageSize) {
      pageSize = opts.pageSize
    }

    // If we're initializing, we need to pass that to the list method.
    let listOpts = { init: data === null, sort: sort.string, page, pageSize }
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
    --rs-light-view-bg: {config.theme.light.viewBg};
    --rs-light-primary: {config.theme.light.primary};
    --rs-light-link: {config.theme.light.link};
    --rs-light-link-hover: {config.theme.light.linkHover};
    --rs-light-link-danger: {config.theme.light.linkDanger};
    --rs-light-link-danger-hover: {config.theme.light.linkDangerHover};
    --rs-light-table-header-bg: {config.theme.light.tableHeaderBg};
    --rs-light-table-border-h: {config.theme.light.tableBorderH};
    --rs-light-table-border-v: {config.theme.light.tableBorderV};
    --rs-light-table-striped-bg: {config.theme.light.tableStripedBg};
    --rs-light-alert-success-bg: {config.theme.light.alertSuccessBg};
    --rs-light-alert-success-fg: {config.theme.light.alertSuccessFg};
    --rs-light-alert-info-bg: {config.theme.light.alertInfoBg};
    --rs-light-alert-info-fg: {config.theme.light.alertInfoFg};
    --rs-light-alert-warning-bg: {config.theme.light.alertWarningBg};
    --rs-light-alert-warning-fg: {config.theme.light.alertWarningFg};
    --rs-light-alert-error-bg: {config.theme.light.alertErrorBg};
    --rs-light-alert-error-fg: {config.theme.light.alertErrorFg};
    --rs-dark-bg: {config.theme.dark.bg};
    --rs-dark-fg: {config.theme.dark.fg};
    --rs-dark-view-bg: {config.theme.dark.viewBg};
    --rs-dark-primary: {config.theme.dark.primary};
    --rs-dark-link: {config.theme.dark.link};
    --rs-dark-link-hover: {config.theme.dark.linkHover};
    --rs-dark-link-danger: {config.theme.dark.linkDanger};
    --rs-dark-link-danger-hover: {config.theme.dark.linkDangerHover};
    --rs-dark-table-header-bg: {config.theme.dark.tableHeaderBg};
    --rs-dark-table-border-h: {config.theme.dark.tableBorderH};
    --rs-dark-table-border-v: {config.theme.dark.tableBorderV};
    --rs-dark-table-striped-bg: {config.theme.dark.tableStripedBg};
    --rs-dark-alert-success-bg: {config.theme.dark.alertSuccessBg};
    --rs-dark-alert-success-fg: {config.theme.dark.alertSuccessFg};
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
    <Scaffold {config} {data} {processing} {sort} />
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

    &:hover {
      color: light-dark(var(--rs-light-link-hover), var(--rs-dark-link-hover));
    }
  }

  .rest-scaffold :global(button.rest-scaffold-danger) {
    color: light-dark(var(--rs-light-link-danger), var(--rs-dark-link-danger));

    &:hover {
      color: light-dark(var(--rs-light-link-danger-hover), var(--rs-dark-link-danger-hover));
    }
  }

  .rest-scaffold :global(.rest-scaffold-view) {
    background-color: light-dark(var(--rs-light-view-bg), var(--rs-dark-view-bg));
  }

  .rest-scaffold :global(.rest-scaffold-view) {
    padding: 0.5em;

    /* Fix issue where padding doesn't work for `tr` elements. */
    :global(& > td) {
      padding: 0.5em;
    }
  }

  .rest-scaffold :global(.rest-scaffold-badge) {
    font-size: 0.8em;
    font-weight: bold;
    padding: 0.2em 0.4em 0.15em 0.4em;
    border-radius: 0.8em;
  }

  .rest-scaffold :global(.rest-scaffold-badge-success) {
    background-color: light-dark(var(--rs-light-alert-success-bg), var(--rs-dark-alert-success-bg));
    color: light-dark(var(--rs-light-alert-success-fg), var(--rs-dark-alert-success-fg));
    border: 0.1em solid
      light-dark(var(--rs-light-alert-success-fg), var(--rs-dark-alert-success-fg));
  }
  .rest-scaffold :global(.rest-scaffold-badge-info) {
    background-color: light-dark(var(--rs-light-alert-info-bg), var(--rs-dark-alert-info-bg));
    color: light-dark(var(--rs-light-alert-info-fg), var(--rs-dark-alert-info-fg));
    border: 0.1em solid light-dark(var(--rs-light-alert-info-fg), var(--rs-dark-alert-info-fg));
  }
  .rest-scaffold :global(.rest-scaffold-badge-warning) {
    background-color: light-dark(var(--rs-light-alert-warning-bg), var(--rs-dark-alert-warning-bg));
    color: light-dark(var(--rs-light-alert-warning-fg), var(--rs-dark-alert-warning-fg));
    border: 0.1em solid
      light-dark(var(--rs-light-alert-warning-fg), var(--rs-dark-alert-warning-fg));
  }
  .rest-scaffold :global(.rest-scaffold-badge-error) {
    background-color: light-dark(var(--rs-light-alert-error-bg), var(--rs-dark-alert-error-bg));
    color: light-dark(var(--rs-light-alert-error-fg), var(--rs-dark-alert-error-fg));
    border: 0.1em solid light-dark(var(--rs-light-alert-error-fg), var(--rs-dark-alert-error-fg));
  }
</style>
