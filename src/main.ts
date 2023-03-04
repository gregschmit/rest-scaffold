import { createApp } from "vue"
import RESTScaffold from "./RESTScaffold.vue"

function initialize() {
  document.querySelectorAll("[data-rest-scaffold]").forEach((el: any) => {
    if (el.__vue_app__) {
      return
    }
    const app = createApp(RESTScaffold)
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
