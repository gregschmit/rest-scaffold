<script>
  let { config, i } = $props()
</script>

<button onclick={() => config.refresh({ page: i })} class="rest-scaffold-link-button">
  {i}
</button>
