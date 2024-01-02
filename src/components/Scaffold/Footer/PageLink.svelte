<script>
  export let config
  export let i
</script>

<button on:click|preventDefault={config.refresh({ page: i })} class="rest-scaffold-link-button">
  {i}
</button>
