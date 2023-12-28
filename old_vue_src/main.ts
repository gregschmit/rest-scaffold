import RESTScaffold from "./RESTScaffold.vue"
import type { Args } from "./config"
import { createApp } from "vue"

function initialize() {
  document.querySelectorAll("[data-rest-scaffold]").forEach((el: any) => {
    if (el.__vue_app__) {
      return
    }
    const args = JSON.parse(el.dataset.restScaffold) as Args
    const app = createApp(RESTScaffold, { args: args })
    app.mount(el)
  })
}

// By default, initialize on page load.
document.addEventListener("DOMContentLoaded", () => {
  initialize()
})

// Export public API as `RESTScaffold` to the window. Consider using import maps?
declare const window: any
window.RESTScaffold = {
  initialize,
}
