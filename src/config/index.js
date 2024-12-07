import API from "./api"

const DEFAULT_PAGINATION_PARAMS = {
  count: "count",
  page: "page",
  pageSize: "page_size",
  totalPages: "total_pages",
  results: "results",
}

const DEFAULT_THEME = {
  fontSize: "0.8em",
}

const DEFAULT_LIGHT_THEME = {
  bg: "white",
  fg: "black",

  primary: "#0d6efd",

  link: "#0d6efd",
  linkHover: "#0a58ca",

  tableHeaderBg: "#eee",
  tableBorderH: "#aeaeae",
  tableBorderV: "#d9d9d9",
  tableStripedBg: "#f7f7f7",

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

  link: "#6ea8fe",
  linkHover: "#8bb9fe",

  tableHeaderBg: "#333",
  tableBorderH: "#666",
  tableBorderV: "#333",
  tableStripedBg: "#222",

  alertInfoBg: "#032830",
  alertInfoFg: "#6edff6",
  alertWarningBg: "#332701",
  alertWarningFg: "#ffda6a",
  alertErrorBg: "#2c0b0e",
  alertErrorFg: "#ea868f",
}

// Represents scaffold configuration, which is derived from the JSON string input of the
// `data-rest-scaffold` attribute, but with tighter contraints, default values, and properties
// hydrated from the `OPTIONS` API.
export default class Config {
  target
  query
  apiType
  pkField
  title
  recordTitle

  inlineEdit

  fields
  fieldConfig

  actionPermissionField
  canShow
  canCreate
  canUpdate
  canDelete

  pagination

  orderParam
  initialOrder

  reload
  refresh
  autoRefresh
  autoRefreshSeconds

  theme
  transparent

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

    this.inlineEdit = args.inlineEdit || false

    this.fields = args.fields
    this.fieldConfig = args.fieldConfig
    if (this.fields && !this.fieldConfig) {
      this.fieldConfig = this.fields.reduce((h, v) => ({ ...h, [v]: {} }), {})
    } else if (this.fieldConfig && !this.fields) {
      this.fields = Object.keys(args.fieldConfig)
    } else if (this.fields && this.fieldConfig) {
      // For each field, add it to the `fieldConfig` if it's not already there.
      for (const field of this.fields) {
        if (!this.fieldConfig[field]) {
          this.fieldConfig[field] = {}
        }
      }
    }

    // Set some reasonable defaults for `fieldConfig`.
    for (const field in this.fieldConfig) {
      this.fieldConfig[field].label ||= field

      if (this.fieldConfig[field].inlineEdit == null) {
        this.fieldConfig[field].inlineEdit = this.inlineEdit
      }
    }

    this.actionPermissionField = args.actionPermissionField || "can_$action?"
    this.canShow = args.canShow == null ? true : args.canShow
    this.canCreate = args.canCreate == null ? true : args.canCreate
    this.canUpdate = args.canUpdate == null ? true : args.canUpdate
    this.canDelete = args.canDelete == null ? true : args.canDelete

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

    this.orderParam = args.orderParam || "order"
    this.initialOrder = args.initialOrder

    this.reload = null
    this.refresh = null
    this.autoRefresh = null
    this.autoRefreshSeconds = args.autoRefreshSeconds

    this.theme = {
      ...DEFAULT_THEME,
      ...args.theme,
      light: {
        ...DEFAULT_LIGHT_THEME,
        ...args.theme?.light,
      },
      dark: {
        ...DEFAULT_DARK_THEME,
        ...args.theme?.dark,
      },
    }
    this.transparent = args.transparent || false

    if (this.transparent) {
      this.theme.light.bg = "transparent"
      this.theme.dark.bg = "transparent"
    }

    this.api = new API(this)
  }
}
