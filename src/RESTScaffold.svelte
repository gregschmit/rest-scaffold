<script>
  import Counter from "./components/Counter.svelte";
</script>

<main>
  <h1>Test with prop: {JSON.stringify($$props)}</h1>

  <div>
    <Counter />
  </div>
</main>
