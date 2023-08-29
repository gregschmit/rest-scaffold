<script>
  export let config
  export let i
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" on:click|preventDefault={config.refresh({ page: i })}>{i}</a>

<style>
  a {
    padding: 0 0.25em;
  }
</style>
