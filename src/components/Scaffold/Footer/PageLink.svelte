<script>
  export let config
  export let i
  console.log(config.theme)
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a
  style="--link: {config.theme.link}; --link-hover: {config.theme.linkHover}"
  href="#"
  on:click|preventDefault={config.refresh({ page: i })}>{i}</a
>

<style>
  a {
    padding: 0 0.25em;

    text-decoration: none;
    color: var(--link);
  }
  a:hover {
    color: var(--link-hover);
  }
</style>
