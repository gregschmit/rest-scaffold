<script>
  import PlainDiv from "../PlainDiv.svelte"

  export let config
</script>

<div class="rest-scaffold-header">
  <span class="rest-scaffold-header-title">{config.title}</span>
  <div>Refresh New</div>
</div>

<style>
  .rest-scaffold-header {
    display: flex;

    margin: 0;
    padding: 0;
    width: 100%;
  }

  .rest-scaffold-header-title {
    padding-right: 0.5em;

    font-size: 1.5em;
    font-weight: bold;
  }
</style>
