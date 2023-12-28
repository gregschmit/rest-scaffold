import API from "./api"

const DEFAULT_PAGINATION_PARAMS = {
  count: "count",
  page: "page",
  pageSize: "page_size",
  totalPages: "total_pages",
  results: "results",
}

const DEFAULT_LIGHT_THEME = {
  bg: "white",
  fg: "black",

  primary: "#0d6efd",
  primaryHover: "#0a58ca",

  tableHeaderBg: "#eee",
  tableBorderH: "#aeaeae",
  tableBorderV: "#d9d9d9",

  alertInfoBg: "#cff4fc",
  alertInfoFg: "#055160",
  alertWarningBg: "#fff3cd",
  alertWarningFg: "#664d03",
  alertErrorBg: "#f8d7da",
  alertErrorFg: "#58151c",
}

const DEFAULT_DARK_THEME = {
  bg: "#181818",
  fg: "#f7f7f7",

  primary: "#6ea8fe",
  primaryHover: "#8bb9fe",

  tableHeaderBg: "#333",
  tableBorderH: "#666",
  tableBorderV: "#333",

  alertInfoBg: "#032830",
  alertInfoFg: "#6edff6",
  alertWarningBg: "#332701",
  alertWarningFg: "#ffda6a",
  alertErrorBg: "#2c0b0e",
  alertErrorFg: "#ea868f",
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
  refresh
  autoRefresh
  autoRefreshSeconds

  mode
  transparent
  lightTheme
  darkTheme
  theme

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
    } else if (this.fields && this.fieldConfig) {
      // For each field, add it to the `fieldConfig` if it's not already there.
      for (const field in this.fields) {
        if (!this.fieldConfig[field]) {
          this.fieldConfig[field] = {}
        }
      }
    }

    // Set some reasonable defaults for `fieldConfig` by iterating over `fieldConfig`.
    for (const field in this.fieldConfig) {
      this.fieldConfig[field].label ||= field
    }

    this.actionPermissionField = args.actionPermissionField || "can_$action?"

    this.pagination = {
      params: { ...DEFAULT_PAGINATION_PARAMS, ...args.pagination?.params },
      pageSize: args.pagination?.pageSize ? [args.pagination?.pageSize].flat() : null,
      window: args.pagination?.window || 1,

      initialPage: args.pagination?.initialPage,
      initialPageSize: null,
    }

    // Initial page size may only be set if the value provided is included in the list of available
    // page sizes; otherwise, it defaults to the first page size option.
    if (this.pagination.pageSize) {
      let initialPageSize = args.pagination?.initialPageSize || null
      if (this.pagination.pageSize.includes(initialPageSize)) {
        this.pagination.initialPageSize = initialPageSize
      } else {
        this.pagination.initialPageSize = this.pagination.pageSize[0]
      }
    }

    this.reload = null
    this.refresh = null
    this.autoRefresh = null
    this.autoRefreshSeconds = args.autoRefreshSeconds

    this.transparent = args.transparent || false
    this.lightTheme = args.lightTheme
    this.darkTheme = args.darkTheme
    this.setModeAndTheme(args.mode)

    this.api = new API(this)
  }

  initialize() {
    if (!this.fields) {
      return "No `fields` configured"
    }

    if (!this.reload) {
      return "No `reload` function configured"
    }

    if (!this.refresh) {
      return "No `refresh` function configured"
    }

    if (!this.autoRefresh) {
      return "No `autoRefresh` function configured"
    }

    return this.api.initialize()
  }

  setTheme() {
    this.theme = {
      ...(this.mode == "dark" ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME),
      ...(this.mode == "dark" ? this.darkTheme : this.lightTheme),
    }

    if (this.transparent) {
      this.theme.bg = "transparent"
    }
  }

  setModeAndTheme(mode) {
    if (mode == "light" || mode == "dark") {
      this.mode = mode
    } else {
      this.mode = "light"
    }

    this.setTheme()

    if (this.reload) {
      this.reload()
    }
  }
}
