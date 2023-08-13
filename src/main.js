import RESTScaffold from "./RESTScaffold.svelte"

function load(el) {
  ;(el || document).parentNode
    ?.querySelectorAll('[data-rest-scaffold]:not([data-rest-scaffold-init="true"]')
    ?.forEach((el) => {
      const args = JSON.parse(el.dataset.restScaffold)

      const app = new RESTScaffold({ target: el, props: { ...args } })
      el.dataset.restScaffoldInit = "true"
    })
}

function autoload(opts = {}) {
  // Load scaffolds on page load.
  document.addEventListener("DOMContentLoaded", () => {
    load()
  })

  // Optionally re-load when DOM nodes are added.
  if (opts.watch_dom) {
    const observer = new MutationObserver((mutations, _observer) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          load(node)
        })
      })
    })
    observer.observe(document, { childList: true, subtree: true })
  }
}

// Export public API as `RESTScaffold` to the window. Consider using import maps?
window.RESTScaffold = { load, autoload }
