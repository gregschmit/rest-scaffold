import { mount as svelteMount } from "svelte"

import RESTScaffold from "./RESTScaffold"

const MOUNTABLE_EL = '[data-rest-scaffold]:not([data-rs-mounted="true"])'

// Mount the `RESTScaffold` component on the given element.
function mountApp(el, inputOpts = null) {
  // We cannot mount unless we have opts (either from `inputOpts` or from the data attribute), or if
  // it's already mounted.
  if (!(inputOpts || el.dataset?.restScaffold) || el.dataset.restScaffoldMounted) {
    return
  }

  el.dataset.restScaffoldMounted = "true"
  el.replaceChildren()

  let opts
  try {
    opts = inputOpts || JSON.parse(el.dataset.restScaffold)
  } catch (e) {
    console.error(`Error parsing JSON from \`data-rest-scaffold\` attr: ${e.message}`)
    return
  }

  const scaffold = svelteMount(RESTScaffold, { target: el, props: { opts } })
  el.restScaffold = scaffold

  return scaffold
}

function scan() {
  document.querySelectorAll(MOUNTABLE_EL).forEach((el) => mountApp(el))
}

function init({ defer = false } = {}) {
  if (defer) {
    document.addEventListener("DOMContentLoaded", () => scan())
  } else {
    scan()
  }
}

function mount(el, opts = {}) {
  if (typeof el === "string") {
    el = document.querySelector(el)
  }

  const shouldDefer = opts.defer
  delete opts.defer

  if (shouldDefer) {
    document.addEventListener("DOMContentLoaded", () => mountApp(el, opts))
  } else {
    return mountApp(el, opts)
  }
}

// Export the public API.
export default { init, mount }
