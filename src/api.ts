import { type Args, Config } from "./config"

const BUILTIN_COLLECTION_ACTIONS = {
  create: { method: "POST" },
}
const BUILTIN_MEMBER_ACTIONS = {
  show: { method: "GET" },
  update: { method: "PATCH" },
  delete: { method: "DELETE" },
}

export type APICallOptions = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS"
  path?: string
  query?: any
  body?: object
  headers?: object
}

export type Response = {
  success: boolean
  payload: any
  error: string | null
}

export type Pagination = {
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export type Listing = {
  results: object[]
  pagination?: Pagination
}

export class API {
  args: Args
  config: Config

  // Build an API object.
  constructor(args: Args) {
    this.args = args
    this.config = new Config(args)
  }

  // Initialize should set up any configuration that is determined by the API itself.
  async initialize(): Promise<string | undefined> {
    let listing = await this.list()

    if (typeof listing === "string") {
      return listing
    }
  }

  async list(): Promise<Listing | string> {
    let response = await this.call({ method: "GET", path: "" })

    if (!response.success) {
      return "Error fetching records."
    }
    let data = response.payload

    if (Array.isArray(data)) {
      return { results: data } as Listing
    } else {
      if (
        !["results", "count", "page", "pageSize", "totalPages"].every((item) =>
          data.hasOwnProperty(item),
        )
      ) {
        return "Invalid paginated response from API."
      }

      return {
        results: data.results,
        pagination: {
          count: parseInt(data.count),
          page: parseInt(data.page),
          pageSize: parseInt(data.page_size),
          totalPages: parseInt(data.total_pages),
        },
      }
    }
  }

  async call(opts: APICallOptions): Promise<Response> {
    let headers = { "Content-Type": "application/json", ...opts.headers }
    let target = [this.config.target, opts.path?.replace(/^\/|\/$/, "")].filter(Boolean).join("/")

    // Append query if present.
    if (opts.query) {
      target += `?${new URLSearchParams(opts.query)}`
    }

    try {
      let response = await fetch(target, {
        method: opts.method,
        headers: headers,
        body: opts.body ? JSON.stringify(opts.body) : null,
      })
      let success = response.ok
      let payload = await response.json()

      return { success, payload, error: null }
    } catch (error: any) {
      return { success: false, payload: null, error: error.message }
    }
  }
}

if (import.meta.vitest) {
  const { describe, expect, it, afterEach } = import.meta.vitest
  const reset_api = new API({ target: "http://localhost:5173/api/reset" } as any)
  const api = new API({ target: "http://localhost:5173/api/plain" } as any)
  const no_json_api = new API({ target: "http://localhost:5173" } as any)
  const bad_api = new API({ target: "http://localhost:9999" } as any)

  async function reset() {
    await reset_api.call({ method: "POST", path: "" })
  }

  describe("API#call", () => {
    afterEach(async () => {
      await reset()
    })

    it("lists users", async () => {
      const { success, payload, error } = await api.call({ method: "GET", path: "users" })
      expect(success).toBe(true)
      expect(payload[0]).toEqual({
        id: 1,
        login: "alice",
        first_name: "Alice",
        last_name: "Smith",
        note: "",
      })
      expect(error).toBe(null)
    })

    it("creates a user", async () => {
      {
        let { success, payload, error } = await api.call({
          method: "POST",
          path: "users",
          body: {
            login: "testy",
            first_name: "Testy",
            last_name: "Testerson",
            note: "",
          },
        })
        expect(success).toBe(true)
        expect(payload).toEqual({ message: "Created." })
        expect(error).toBe(null)
      }

      let { success, payload, error } = await api.call({ method: "GET", path: "users" })
      expect(success).toBe(true)
      expect(payload.find((u: any) => u.login === "testy")).toBeDefined()
      expect(error).toBe(null)
    })

    it("fails with validation errors", async () => {
      const { success, payload, error } = await api.call({
        method: "POST",
        path: "users",
        body: {},
      })
      expect(success).toBe(false)
      expect(payload).toEqual({
        message: "Login is required.",
        errors: [{ login: "is required." }],
      })
      expect(error).toBe(null)
    })

    it("errors if API doesn't return JSON", async () => {
      const { success, payload, error } = await no_json_api.call({ method: "GET", path: "users" })
      expect(success).toBe(false)
      expect(payload).toBe(null)
      expect(error).toBe("Unexpected token < in JSON at position 0")
    })

    it("errors if it can't connect to API", async () => {
      const { success, payload, error } = await bad_api.call({ method: "GET", path: "users" })
      expect(success).toBe(false)
      expect(payload).toBe(null)
      expect(error).toBe("fetch failed")
    })
  })
}
