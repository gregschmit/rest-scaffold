import RESTScaffold from "./RESTScaffold.svelte"

const MOUNTABLE_EL = '[data-rest-scaffold]:not([data-rest-scaffold-mounted="true"])'

// Mount the `RESTScaffold` component on the given element.
function mount(el) {
  // Mirror the constraints of `MOUNTABLE_EL` to guard against races and other mount issues.
  if (!el.dataset?.restScaffold || el.dataset.restScaffoldMounted) {
    return
  }

  el.dataset.restScaffoldMounted = "true"
  el.replaceChildren()
  const args = JSON.parse(el.dataset.restScaffold)
  const app = new RESTScaffold({ target: el, props: args })
}

function setupOnElement(el) {
  if (el) {
    if (el.dataset?.restScaffold) {
      mount(el)
    } else {
      el.querySelectorAll(MOUNTABLE_EL).forEach(mount)
    }
  } else {
    document.querySelectorAll(MOUNTABLE_EL).forEach(mount)
  }
}

function setup(opts = {}) {
  if (opts.defer) {
    document.addEventListener("DOMContentLoaded", () => {
      setupOnElement(opts.el)
    })
  } else {
    setupOnElement(opts.el)
  }
}

// Export the public API.
export default { setup }
