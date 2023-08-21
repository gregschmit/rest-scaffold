import RESTScaffold from "./RESTScaffold"

const MOUNTABLE_EL = '[data-rest-scaffold]:not([data-rest-scaffold-mounted="true"])'

// Mount the `RESTScaffold` component on the given element.
function mount(el, input_args) {
  // We cannot mount unless we have args (either from `input_args` or from the data attribute), or
  // if it's already mounted.
  if (!(input_args || el.dataset?.restScaffold) || el.dataset.restScaffoldMounted) {
    return
  }

  el.dataset.restScaffoldMounted = "true"
  el.replaceChildren()

  let args
  try {
    args = input_args ? input_args : JSON.parse(el.dataset.restScaffold)
  } catch (e) {
    console.error(`Error parsing JSON from \`data-rest-scaffold\` attr: ${e.message}`)
    return
  }

  new RESTScaffold({ target: el, props: { args: args } })
}

function setupNow(opts = {}) {
  if (opts.el) {
    if (opts.args) {
      mount(opts.el, opts.args)
    } else if (opts.el.dataset?.restScaffold) {
      mount(opts.el)
    } else {
      opts.el.querySelectorAll(MOUNTABLE_EL).forEach((el) => {
        mount(el)
      })
    }
  } else {
    document.querySelectorAll(MOUNTABLE_EL).forEach((el) => {
      mount(el)
    })
  }
}

function setup(opts = {}) {
  const should_defer = opts.defer
  delete opts.defer
  if (should_defer) {
    document.addEventListener("DOMContentLoaded", () => {
      setupNow(opts)
    })
  } else {
    setupNow(opts)
  }
}

// Export the public API.
export default { setup }
