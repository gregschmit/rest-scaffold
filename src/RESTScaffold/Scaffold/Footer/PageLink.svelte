<script>
  let { config, i } = $props()
</script>

<button onclick={() => config.refresh({ page: i })} class="rs-link-button">
  {i}
</button>
