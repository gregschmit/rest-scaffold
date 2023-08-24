const BUILTIN_COLLECTION_ACTIONS = {
  create: { method: "POST" },
}
const BUILTIN_MEMBER_ACTIONS = {
  show: { method: "GET" },
  update: { method: "PATCH" },
  delete: { method: "DELETE" },
}
const WINDOW = 1

export default class API {
  config

  constructor(config) {
    this.config = config
  }

  // Initialize should set up any configuration that is determined by the API itself.
  async initialize() {
    let data = await this.list()

    if (typeof data !== "string") {
      // TODO: Hydrate the configuration using the fetched records, if any were returned. This
      // requires the API to return at least one result, but could be a nice starting experience.
      // TODO: Hydrate the configuration using the `OPTIONS` API.
    }

    return data
  }

  // Attempt a `GET` on the API root, and normalize any pagination parameters.
  async list() {
    let result = await this.call({
      method: "GET",
      query: {
        ...(this.config.pagination.page ? { page: this.config.pagination.page } : null),
        ...this.config.query,
      },
    })

    if (!result.response?.ok) {
      return `Error: ${result.error || "Not found"}`
    }
    let payload = result.payload

    // Handle flat payload.
    if (Array.isArray(payload)) {
      return { results: payload }
    }

    // Handle paginated payload.
    if (
      !Object.values(this.config.pagination.params).every((item) => payload.hasOwnProperty(item))
    ) {
      return "Invalid paginated response"
    }
    const pagination = {
      count: parseInt(payload[this.config.pagination.params.count]),
      page: parseInt(payload[this.config.pagination.params.page]),
      pageSize: parseInt(payload[this.config.pagination.params.pageSize]),
      totalPages: parseInt(payload[this.config.pagination.params.totalPages]),
    }

    return {
      results: payload[this.config.pagination.params.results],
      pagination: {
        ...pagination,
        display: this.getPaginationDisplay(pagination.page, pagination.totalPages),
      },
    }
  }

  getPaginationDisplay(page, totalPages) {
    let beforeWindow = [...Array(WINDOW).keys()].map((i) => page - WINDOW + i).filter((i) => i > 0)
    let afterWindow = [...Array(WINDOW).keys()]
      .map((i) => page + 1 + i)
      .filter((i) => i <= totalPages)
    let startWindow = [...Array(WINDOW).keys()].map((i) => i + 1).filter((i) => i < beforeWindow[0])
    let endWindow = [...Array(WINDOW).keys()]
      .map((i) => totalPages - WINDOW + i + 1)
      .filter((i) => i > afterWindow[afterWindow.length - 1])

    // Merge startWindow into beforeWindow if it's contiguous.
    if (startWindow[startWindow.length - 1] === beforeWindow[0] - 1) {
      beforeWindow = [...startWindow, ...beforeWindow]
      startWindow = []
    }

    // Merge endWindow into afterWindow if it's contiguous.
    if (endWindow[0] === afterWindow[afterWindow.length - 1] + 1) {
      afterWindow = [...afterWindow, ...endWindow]
      endWindow = []
    }

    return { startWindow, beforeWindow, afterWindow, endWindow }
  }

  async call(opts) {
    let url = [this.config.target, opts.path?.replace(/^\/|\/$/, "")].filter(Boolean).join("/")

    // Append query params if present.
    if (opts.query) {
      url += `?${new URLSearchParams(opts.query)}`
    }

    try {
      let response = await fetch(url, {
        method: opts.method,
        headers: { "Content-Type": "application/json", ...opts.headers },
        body: opts.body ? JSON.stringify(opts.body) : null,
      })
      let payload = await response.json()
      let result = { response, payload }

      if (!response.ok) {
        result.error = `${this.config.debug ? `[${response.status} ${response.statusText}]` : ""} ${
          payload.message
        }]`.trim()
      }

      return result
    } catch (error) {
      if (error instanceof SyntaxError) {
        return { error: "Bad response (invalid JSON)" }
      }

      return { error: `Request failed${this.config.debug ? ` (${error.message})` : ""}` }
    }
  }
}

// TODO: Maybe test this stuff?

// const reset_api = new API({ target: "http://localhost:5173/api/reset" })
// const api = new API({ target: "http://localhost:5173/api/plain" })
// const no_json_api = new API({ target: "http://localhost:5173" })
// const bad_api = new API({ target: "http://localhost:9999" })

// async function reset() {
//   await reset_api.call({ method: "POST", path: "" })
// }

// describe("API#call", () => {
//   afterEach(async () => {
//     await reset()
//   })

//   it("lists users", async () => {
//     const { success, payload, error } = await api.call({ method: "GET", path: "users" })
//     expect(success).toBe(true)
//     expect(payload[0]).toEqual({
//       id: 1,
//       login: "alice",
//       first_name: "Alice",
//       last_name: "Smith",
//       note: "",
//     })
//     expect(error).toBe(null)
//   })

//   it("creates a user", async () => {
//     {
//       let { success, payload, error } = await api.call({
//         method: "POST",
//         path: "users",
//         body: {
//           login: "testy",
//           first_name: "Testy",
//           last_name: "Testerson",
//           note: "",
//         },
//       })
//       expect(success).toBe(true)
//       expect(payload).toEqual({ message: "Created." })
//       expect(error).toBe(null)
//     }

//     let { success, payload, error } = await api.call({ method: "GET", path: "users" })
//     expect(success).toBe(true)
//     expect(payload.find((u: any) => u.login === "testy")).toBeDefined()
//     expect(error).toBe(null)
//   })

//   it("fails with validation errors", async () => {
//     const { success, payload, error } = await api.call({
//       method: "POST",
//       path: "users",
//       body: {},
//     })
//     expect(success).toBe(false)
//     expect(payload).toEqual({
//       message: "Login is required.",
//       errors: [{ login: "is required." }],
//     })
//     expect(error).toBe(null)
//   })

//   it("errors if API doesn't return JSON", async () => {
//     const { success, payload, error } = await no_json_api.call({ method: "GET", path: "users" })
//     expect(success).toBe(false)
//     expect(payload).toBe(null)
//     expect(error).toBe("Unexpected token < in JSON at position 0")
//   })

//   it("errors if it can't connect to API", async () => {
//     const { success, payload, error } = await bad_api.call({ method: "GET", path: "users" })
//     expect(success).toBe(false)
//     expect(payload).toBe(null)
//     expect(error).toBe("fetch failed")
//   })
// })
