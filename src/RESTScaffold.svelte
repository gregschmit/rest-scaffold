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

  let { opts } = $props()

  let config = new Config(opts)
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
    --rs-light-table-header-bg: {config.theme.light.tableHeaderBg};
    --rs-light-table-border-h: {config.theme.light.tableBorderH};
    --rs-light-table-border-v: {config.theme.light.tableBorderV};
    --rs-light-table-striped-bg: {config.theme.light.tableStripedBg};
    --rs-light-primary: {config.theme.light.primary};
    --rs-light-primary-hover: {config.theme.light.primaryHover};
    --rs-light-danger: {config.theme.light.danger};
    --rs-light-danger-hover: {config.theme.light.dangerHover};
    --rs-light-info-bg: {config.theme.light.infoBg};
    --rs-light-info-fg: {config.theme.light.infoFg};
    --rs-light-success-bg: {config.theme.light.successBg};
    --rs-light-success-fg: {config.theme.light.successFg};
    --rs-light-warning-bg: {config.theme.light.warningBg};
    --rs-light-warning-fg: {config.theme.light.warningFg};
    --rs-light-error-bg: {config.theme.light.errorBg};
    --rs-light-error-fg: {config.theme.light.errorFg};
    --rs-dark-bg: {config.theme.dark.bg};
    --rs-dark-fg: {config.theme.dark.fg};
    --rs-dark-view-bg: {config.theme.dark.viewBg};
    --rs-dark-table-header-bg: {config.theme.dark.tableHeaderBg};
    --rs-dark-table-border-h: {config.theme.dark.tableBorderH};
    --rs-dark-table-border-v: {config.theme.dark.tableBorderV};
    --rs-dark-table-striped-bg: {config.theme.dark.tableStripedBg};
    --rs-dark-primary: {config.theme.dark.primary};
    --rs-dark-primary-hover: {config.theme.dark.primaryHover};
    --rs-dark-danger: {config.theme.dark.danger};
    --rs-dark-danger-hover: {config.theme.dark.dangerHover};
    --rs-dark-info-bg: {config.theme.dark.infoBg};
    --rs-dark-info-fg: {config.theme.dark.infoFg};
    --rs-dark-success-bg: {config.theme.dark.successBg};
    --rs-dark-success-fg: {config.theme.dark.successFg};
    --rs-dark-warning-bg: {config.theme.dark.warningBg};
    --rs-dark-warning-fg: {config.theme.dark.warningFg};
    --rs-dark-error-bg: {config.theme.dark.errorBg};
    --rs-dark-error-fg: {config.theme.dark.errorFg};
  "
>
  {#if loadError}
    <Alert type="error" message={loadError} />
  {/if}

  <!-- Uncomment the below to see examples of alters/badges/buttons. -->
  <!--
  <Alert type="info" message={"test info"} />
  <Alert type="success" message={"test success"} />
  <Alert type="warning" message={"test warning"} />
  <Alert type="error" message={"test error"} />

  <span class="rs-badge rs-badge-info">Info</span>
  <span class="rs-badge rs-badge-success">Success</span>
  <span class="rs-badge rs-badge-warning">Warning</span>
  <span class="rs-badge rs-badge-error">Error</span>

  <button class="rs-button">Regular</button>
  <button class="rs-button rs-button-large">Regular</button>
  <button class="rs-button rs-button-primary">Primary</button>
  <button class="rs-button rs-button-large rs-button-primary">Primary</button>
  <button class="rs-button rs-button-danger">Danger</button>
  <button class="rs-button rs-button-large rs-button-danger">Danger</button>
  -->

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

  /* Style links (and link buttons). */
  .rest-scaffold :global(a) {
    color: light-dark(var(--rs-light-primary), var(--rs-dark-primary));
    text-decoration: none;
  }
  .rest-scaffold :global(a:hover) {
    color: light-dark(var(--rs-light-primary-hover), var(--rs-dark-primary-hover));
    text-decoration: underline;
  }
  .rest-scaffold :global(.rs-link-button) {
    color: light-dark(var(--rs-light-primary), var(--rs-dark-primary));
    cursor: pointer;

    background: none;
    border: none;
    font-family: sans-serif;
    font-size: inherit;
    font-weight: bold;
    padding: 0 0.25em;

    &:hover {
      color: light-dark(var(--rs-light-primary-hover), var(--rs-dark-primary-hover));
    }
  }
  .rest-scaffold :global(.rs-link-danger) {
    color: light-dark(var(--rs-light-danger), var(--rs-dark-danger));

    &:hover {
      color: light-dark(var(--rs-light-danger-hover), var(--rs-dark-danger-hover));
    }
  }

  /* Style badges. */
  .rest-scaffold :global(.rs-badge) {
    font-size: 0.8em;
    font-weight: bold;
    padding: 0.2em 0.4em 0.15em 0.4em;
    border-radius: 0.8em;
  }
  .rest-scaffold :global(.rs-badge-info) {
    background-color: light-dark(var(--rs-light-info-bg), var(--rs-dark-info-bg));
    color: light-dark(var(--rs-light-info-fg), var(--rs-dark-info-fg));
    border: 0.1em solid light-dark(var(--rs-light-info-fg), var(--rs-dark-info-fg));
  }
  .rest-scaffold :global(.rs-badge-success) {
    background-color: light-dark(var(--rs-light-success-bg), var(--rs-dark-success-bg));
    color: light-dark(var(--rs-light-success-fg), var(--rs-dark-success-fg));
    border: 0.1em solid light-dark(var(--rs-light-success-fg), var(--rs-dark-success-fg));
  }
  .rest-scaffold :global(.rs-badge-warning) {
    background-color: light-dark(var(--rs-light-warning-bg), var(--rs-dark-warning-bg));
    color: light-dark(var(--rs-light-warning-fg), var(--rs-dark-warning-fg));
    border: 0.1em solid light-dark(var(--rs-light-warning-fg), var(--rs-dark-warning-fg));
  }
  .rest-scaffold :global(.rs-badge-error) {
    background-color: light-dark(var(--rs-light-error-bg), var(--rs-dark-error-bg));
    color: light-dark(var(--rs-light-error-fg), var(--rs-dark-error-fg));
    border: 0.1em solid light-dark(var(--rs-light-error-fg), var(--rs-dark-error-fg));
  }

  /* Style buttons. */
  .rest-scaffold :global(.rs-button) {
    padding: 0.2em 0.5em;
    margin-right: 0.5em;
    border: 0.05em solid;
    border-color: light-dark(black, white);
    border-radius: 0.2em;

    &:hover {
      filter: brightness(0.95);
    }

    &:active {
      filter: brightness(0.9);
    }
  }
  .rest-scaffold :global(.rs-button-large) {
    font-weight: bold;
    padding: 0.5em 1em;
    margin: 0.7em 0.5em 0.5em 0;
  }
  .rest-scaffold :global(.rs-button-primary) {
    background-color: light-dark(var(--rs-light-primary), var(--rs-dark-primary));
    color: light-dark(white, black);
  }
  .rest-scaffold :global(.rs-button-danger) {
    background-color: light-dark(var(--rs-light-danger), var(--rs-dark-danger));
    color: light-dark(white, black);
  }

  /* Style scaffold views. */
  .rest-scaffold :global(.rs-view) {
    background-color: light-dark(var(--rs-light-view-bg), var(--rs-dark-view-bg));
  }
  .rest-scaffold :global(.rs-view) {
    padding: 0.5em;

    /* Fix issue where padding doesn't work for `tr` elements. */
    :global(& > td) {
      padding: 0.5em;
    }

    :global(.rs-view-title) {
      display: block;
      font-size: 1.2em;
      font-weight: bold;
      margin: 0.2em 0 0.8em 0;
    }
  }

  /* Style prefix/postfix input labels. */
  .rest-scaffold :global(label.rs-label-prefix) {
    display: block;
    font-weight: bold;
    margin: 0.5em 0 0.1em 0;
  }
  .rest-scaffold :global(label.rs-label-postfix) {
    margin: 0.5em 0 0 0.2em;
  }

  /* Style form inputs. */
  .rest-scaffold :global(form input) {
    padding: 0.3em;

    :global(&[type="text"], &[type="number"], &[type="password"], &[type="email"]) {
      width: 100%;
      box-sizing: border-box;
    }
  }
  .rest-scaffold :global(.rs-form-field-boolean label) {
    display: inline-block;
    padding-right: 1.5em;
    white-space: nowrap;

    :global(input) {
      vertical-align: middle;
    }
    :global(span) {
      vertical-align: middle;
    }
  }
</style>
