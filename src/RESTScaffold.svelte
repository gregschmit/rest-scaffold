<script>
  import { onMount } from "svelte"
  import Config from "./config/index"

  import Spinner from "./components/Spinner"
  import Scaffold from "./components/Scaffold"
  import Alert from "./components/Alert"

  export let args

  let state = "initializing"
  let config = new Config(args)

  onMount(async () => {
    if (await config.initialize()) {
      state = "ready"
    } else {
      state = "error"
    }
  })
</script>

<div class="rest-scaffold-main">
  {#if state == "initializing"}
    <Spinner />
  {:else if state == "error"}
    <Alert type="error" message={config.initializationError} />
  {:else}
    <Scaffold {config} />
  {/if}
</div>

<style>
  .rest-scaffold-main {
    margin: 1em 0;
    padding: 0;
    width: 100%;

    font-family: sans-serif;
    font-size: 0.8em;
  }
</style>
