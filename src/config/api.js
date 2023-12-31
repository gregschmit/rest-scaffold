const BUILTIN_COLLECTION_ACTIONS = {
  create: { method: "POST" },
}
const BUILTIN_MEMBER_ACTIONS = {
  show: { method: "GET" },
  update: { method: "PATCH" },
  delete: { method: "DELETE" },
}

export default class API {
  config

  constructor(config) {
    this.config = config
  }

  // Hydrate the config from the data, potentially also using the `OPTIONS` API.
  async initialize(data) {
    if (typeof data !== "string") {
      // TODO: Hydrate the configuration using the fetched records, if any were returned. This
      // requires the API to return at least one result, but could be a nice starting experience.
      // TODO: Hydrate the configuration using the `OPTIONS` API.
    }

    return data
  }

  // Attempt a `GET` on the API root, and normalize any pagination parameters.
  async list(opts = {}) {
    let builtinQuery = {}

    if (opts.order) {
      builtinQuery[this.config.orderParam] = opts.order
    }

    if (opts.page) {
      builtinQuery[this.config.pagination.params.page] = opts.page
    }

    if (opts.pageSize) {
      builtinQuery[this.config.pagination.params.pageSize] = opts.pageSize
    }

    let result = await this.call({
      method: "GET",
      query: { ...builtinQuery, ...this.config.query },
    })

    if (!result.response?.ok) {
      return `Error: ${result.error || "Not found"}`
    }
    let payload = result.payload

    // Handle null payload.
    if (!payload) {
      return "Invalid payload (null)"
    }

    // Handle flat payload.
    if (Array.isArray(payload)) {
      let data = { results: payload }
      if (opts.init) {
        await this.initialize(data)
      }
      return data
    }

    // Handle payload that is not an object.
    if (typeof payload !== "object") {
      return "Invalid payload (not an array or object)"
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

    let data = {
      results: payload[this.config.pagination.params.results],
      pagination: {
        ...pagination,
        display: this.getPaginationDisplay(pagination.page, pagination.totalPages),
      },
      payload: payload,
    }
    if (opts.init) {
      await this.initialize(data)
    }
    return data
  }

  getPaginationDisplay(page, totalPages) {
    if (!page || !totalPages || totalPages <= 1) {
      return null
    }

    const window = this.config.pagination.window

    let beforeWindow = [...Array(window).keys()].map((i) => page - window + i).filter((i) => i > 0)
    let afterWindow = [...Array(window).keys()]
      .map((i) => page + 1 + i)
      .filter((i) => i <= totalPages)
    let startWindow = [...Array(window).keys()].map((i) => i + 1).filter((i) => i < beforeWindow[0])
    let endWindow = [...Array(window).keys()]
      .map((i) => totalPages - window + i + 1)
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
        result.error = `[${response.status} ${response.statusText}] ${payload.message}]`.trim()
      }

      return result
    } catch (error) {
      if (error instanceof SyntaxError) {
        return { error: "Bad response (invalid JSON)" }
      }

      return { error: `Request failed (${error.message})` }
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
