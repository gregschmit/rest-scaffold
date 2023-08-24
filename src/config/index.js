import API from "./api"

const DEFAULT_PAGINATION_PARAMS = {
  count: "count",
  page: "page",
  pageSize: "page_size",
  totalPages: "total_pages",
  results: "results",
}

const DEFAULT_THEME = {
  light: {
    bg: "white",
    fg: "black",
    link: "#0d6efd",
    linkHover: "#0a58ca",
    alert: {
      info: { bg: "#cff4fc", fg: "#055160" },
      warning: { bg: "#fff3cd", fg: "#664d03" },
      error: { bg: "#f8d7da", fg: "#58151c" },
    },
  },
  dark: {
    bg: "black",
    fg: "white",
    link: "#6ea8fe",
    linkHover: "#8bb9fe",
    alert: {
      info: { bg: "#032830", fg: "#6edff6" },
      warning: { bg: "#332701", fg: "#ffda6a" },
      error: { bg: "#2c0b0e", fg: "#ea868f" },
    },
  },
}

// Represents scaffold configuration, which is derived from the JSON string input of the
// `data-rest-scaffold` attribute, but with tighter contraints, default values, and properties
// hydrated from the API.
export default class Config {
  target
  query
  apiType
  pkField
  title
  recordTitle

  fields
  fieldConfig
  actionPermissionField

  pagination

  reload
  refreshSeconds
  refresh
  refreshLock

  mode
  transparent
  inputTheme
  theme

  debug

  // disabled_builtin_actions: string[]
  // extra_collection_actions: object
  // extra_member_actions: object

  // TODO: CSRF
  // csrfToken?: string
  // csrfTokenHeader?: string

  api

  constructor(args) {
    // Trim query and trailing slash off target URL.
    this.target = args.target.replace(/\?.*/, "").replace(/\/+$/, "")
    this.query = args.query || {}

    this.apiType = args.apiType
    this.pkField = args.pkField || "id"
    this.title = args.title || "Records"
    this.recordTitle = args.recordTitle || "Record"

    this.fields = args.fields
    this.fieldConfig = args.fieldConfig
    if (this.fields && !this.fieldConfig) {
      this.fieldConfig = this.fields.reduce((h, v) => ({ ...h, [v]: {} }), {})
    } else if (this.fieldConfig && !this.fields) {
      this.fields = Object.keys(args.fieldConfig)
    }

    this.actionPermissionField = args.actionPermissionField || "can_$action?"

    this.pagination = {
      params: { ...DEFAULT_PAGINATION_PARAMS, ...args.pagination?.params },
      page: args.pagination?.page,
    }

    this.reload = null
    this.refresh = null
    this.autoRefreshSeconds = args.refreshSeconds === undefined ? 5 : args.refreshSeconds
    this.autoRefreshLock = new Set()

    this.mode = args.mode || "light"
    this.transparent = args.transparent || false
    this.inputTheme = args.theme
    this.setTheme()

    this.debug = args.debug || false

    this.api = new API(this)
  }

  initialize() {
    if (!this.fields) {
      return "No `fields` configured"
    }

    if (!this.refresh) {
      return "No `refresh` function configured"
    }

    if (!this.reload) {
      return "No `reload` function configured"
    }

    let data = this.api.initialize()

    if (typeof data === "object") {
      this._autoRefresh()
    }

    return data
  }

  setTheme() {
    this.theme = {
      ...DEFAULT_THEME[this.mode],
      ...this.inputTheme?.[this.mode],
      alert: {
        info: {
          ...DEFAULT_THEME[this.mode].alert.info,
          ...this.inputTheme?.[this.mode]?.alert?.info,
        },
        warning: {
          ...DEFAULT_THEME[this.mode].alert.warning,
          ...this.inputTheme?.[this.mode]?.alert?.warning,
        },
        error: {
          ...DEFAULT_THEME[this.mode].alert.error,
          ...this.inputTheme?.[this.mode]?.alert?.error,
        },
      },
    }

    if (this.transparent) {
      this.theme.bg = "transparent"
    }
  }

  _autoRefresh() {
    if (this.autoRefreshSeconds && this.refresh) {
      setTimeout(async () => {
        await this.refresh()
        _autoRefresh()
      }, this.autoRefreshSeconds * 1000)
    }
  }
}
