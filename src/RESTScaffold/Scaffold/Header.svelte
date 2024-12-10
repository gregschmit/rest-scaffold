<script>
  import Spinner from "../Spinner"
  import CloseButton from "./CloseButton"

  let { config, processing } = $props()

  let viewState = $state(null)
</script>

<div class="rest-scaffold-header">
  <span class="rest-scaffold-header-title">
    {config.title}
    {#if processing}
      <Spinner size=".8em" />
    {/if}
  </span>
  <span>
    {#if config.help}
      <button class="rest-scaffold-link-button" onclick={() => (viewState = "help")}>Help</button>
    {/if}
    {#if config.canRefresh}
      <button class="rest-scaffold-link-button" onclick={() => config.refresh()}>Refresh</button>
    {/if}
    {#if config.canCreate}
      <button class="rest-scaffold-link-button" onclick={() => (viewState = "new")}>New</button>
    {/if}
  </span>
</div>

{#if viewState === "help"}
  <div class="rest-scaffold-view rest-scaffold-help">
    {@html config.help}
    <CloseButton action={() => (viewState = null)} />
  </div>
{/if}

{#if viewState === "new"}
  <div class="rest-scaffold-view rest-scaffold-new">
    <CloseButton action={() => (viewState = null)} />
  </div>
{/if}

<style>
  .rest-scaffold-header {
    display: flex;
    justify-content: space-between;

    margin: 0;
    padding: 0.2em;
    width: 100%;
    box-sizing: border-box;

    font-weight: bold;
  }

  .rest-scaffold-header-title {
    padding-right: 0.5em;

    font-size: 1.5em;
    font-weight: bold;
  }
</style>
