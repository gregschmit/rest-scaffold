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

  config.reload = () => {
    config = config
  }
  config.refresh = async () => {
    data = await config.api.list()
  }

  onMount(async () => {
    data = await config.initialize()

    if (typeof data === "string") {
      initializationError = data
    }
  })
</script>

<div class="rest-scaffold-main">
  {#if initializationError}
    <Alert type="error" message={initializationError} />
  {:else if data}
    <Scaffold {config} {data} />
  {:else}
    <Spinner />
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
