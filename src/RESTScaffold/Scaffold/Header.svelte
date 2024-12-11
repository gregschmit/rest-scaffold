<script>
  import Spinner from "../Spinner"
  import CloseButton from "./CloseButton"
  import Form from "./Form"

  let { config, processing } = $props()

  let viewState = $state(null)
</script>

<div class="rs-header">
  <span class="rs-header-title">
    {config.title}
    {#if processing}
      <Spinner size=".8em" />
    {/if}
  </span>
  <span>
    {#if config.help}
      <button class="rs-link-button" onclick={() => (viewState = "help")}>Help</button>
    {/if}
    {#if config.canRefresh}
      <button class="rs-link-button" onclick={() => config.refresh()}>Refresh</button>
    {/if}
    {#if config.canCreate}
      <button class="rs-link-button" onclick={() => (viewState = "new")}>New</button>
    {/if}
  </span>
</div>

{#if viewState === "help"}
  <div class="rs-view rs-help">
    <CloseButton action={() => (viewState = null)} />
    <span class="rs-view-title">Help</span>
    {@html config.help}
  </div>
{/if}

{#if viewState === "new"}
  <div class="rs-view rs-new">
    <CloseButton action={() => (viewState = null)} />
    <span class="rs-view-title">New {config.recordTitle}</span>
    <Form {config} {viewState} />
  </div>
{/if}

<style>
  .rs-header {
    display: flex;
    justify-content: space-between;

    margin: 0;
    padding: 0.2em;
    width: 100%;
    box-sizing: border-box;

    font-weight: bold;
  }

  .rs-header-title {
    padding-right: 0.5em;

    font-size: 1.5em;
    font-weight: bold;
  }
</style>
