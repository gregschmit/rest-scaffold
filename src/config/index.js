import API from "./api"

const DEFAULT_THEME = {
  fontSize: "0.8em",
}

const DEFAULT_LIGHT_THEME = {
  bg: "white",
  fg: "black",
  viewBg: "#d9d9d9",

  primary: "#0d6efd",

  link: "#0d6efd",
  linkHover: "#0a58ca",
  linkDanger: "#dc3545",
  linkDangerHover: "#b02a37",

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
  viewBg: "#333",

  primary: "#6ea8fe",

  link: "#6ea8fe",
  linkHover: "#8bb9fe",
  linkDanger: "#ff5b6b",
  linkDangerHover: "#ff7b89",

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
  query = {}
  apiType
  pkField = "id"
  title = "Records"
  recordTitle = "Record"
  help

  inlineEdit = false

  fields
  fieldConfig

  actionPermissionField = "can_$action?"
  canShow = true
  canCreate = true
  canUpdate = true
  canDelete = true
  canRefresh = true

  pagination = {
    params: {
      count: "count",
      page: "page",
      pageSize: "page_size",
      totalPages: "total_pages",
      results: "results",
    },
    pageSize: null,
    window: 1,
    initialPage: null,
  }

  orderParam = "order"
  initialOrder

  refresh
  autoRefresh
  autoRefreshSeconds

  theme = { ...DEFAULT_THEME, light: DEFAULT_LIGHT_THEME, dark: DEFAULT_DARK_THEME }

  // disabled_builtin_actions: string[]
  // extra_collection_actions: object
  // extra_member_actions: object

  // TODO: CSRF
  // csrfToken?: string
  // csrfTokenHeader?: string

  api

  isObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj)
  }

  // Set the properties of an object from a dictionary of arguments, only if the property exists on
  // the object. Recursively set properties of nested objects.
  assignArgs(object, args) {
    for (const key in args) {
      if (object.hasOwnProperty(key)) {
        if (this.isObject(object[key]) && this.isObject(args[key])) {
          this.assignArgs(object[key], args[key])
        } else {
          object[key] = args[key]
        }
      }
    }
  }

  constructor(args) {
    this.assignArgs(this, args)

    // Trim query and trailing slash off target URL.
    this.target = this.target.replace(/\?.*/, "").replace(/\/+$/, "")

    // Dynamically populate `fields` and `fieldConfig` if only one is provided.
    if (this.fields && !this.fieldConfig) {
      this.fieldConfig = this.fields.reduce((h, v) => ({ ...h, [v]: {} }), {})
    } else if (this.fieldConfig && !this.fields) {
      this.fields = Object.keys(this.fieldConfig)
    } else if (this.fields && this.fieldConfig) {
      // For each field, add it to the `fieldConfig` if it's not already there.
      for (const field of this.fields) {
        if (!this.fieldConfig[field]) {
          this.fieldConfig[field] = {}
        }
      }
    }

    // Set some reasonable defaults for `fieldConfig`.
    // TODO: remove this and replace with helper.
    for (const field in this.fieldConfig) {
      this.fieldConfig[field].label ||= field
    }

    // Ensure `pagination.pageSize` is an array.
    if (!Array.isArray(this.pagination.pageSize)) {
      this.pagination.pageSize = [this.pagination.pageSize]
    }

    this.api = new API(this)
  }

  // Render a value according to the field configuration.
  render(field, value) {
    if (this.fieldConfig[field].render) {
      return this.fieldConfig[field].render(value)
    }

    return value
  }

  // Render a value in a more detailed manner according to the field configuration.
  renderDetail(field, value) {
    if (this.fieldConfig[field].renderDetail) {
      return this.fieldConfig[field].renderDetail(value)
    } else if (this.fieldConfig[field].render) {
      return this.fieldConfig[field].render(value)
    }

    return value
  }

  // Render an HTML input for a field, given an optional initial value.
  renderInput(field, { value }) {
    return `<input type="text" value="${value || ""}" />`
  }
}
