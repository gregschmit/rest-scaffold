<script>
  import Spinner from "../Spinner.svelte"

  export let config
  export let processing
</script>

<div class="rest-scaffold-header">
  <span class="rest-scaffold-header-title">
    {config.title}
    {#if processing}
      <Spinner size=".8em" />
    {/if}
  </span>
  <span></span>
</div>

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
