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

  alertSuccessBg: "#a6e0c6",
  alertSuccessFg: "#024012",
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

  alertSuccessBg: "#0b2e13",
  alertSuccessFg: "#23d950",
  alertInfoBg: "#032830",
  alertInfoFg: "#6edff6",
  alertWarningBg: "#332701",
  alertWarningFg: "#ffda6a",
  alertErrorBg: "#2c0b0e",
  alertErrorFg: "#ea868f",
}

class HTMLSafeString extends String {}

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

  sortable = false
  sortParam = "ordering"
  initialSort

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
    for (const field in this.fieldConfig) {
      const fcfg = this.fieldConfig[field]

      fcfg.label ||= field

      if (this.sortable && fcfg.sortable == null) {
        fcfg.sortable = true
      }
    }

    // Ensure `pagination.pageSize` is an array.
    if (!Array.isArray(this.pagination.pageSize)) {
      this.pagination.pageSize = [this.pagination.pageSize]
    }

    this.api = new API(this)
  }

  // Convert a string to an `HtmlSafeString` object.
  htmlSafe(s) {
    return new HTMLSafeString(s)
  }

  // Escape an unsafe string for rendering as HTML.
  escape(s) {
    if (s instanceof HTMLSafeString) {
      return s
    }

    let el = document.createElement("span")
    el.innerText = s
    return el.innerHTML
  }

  formatBoolean(value, { format } = {}) {
    if (format) {
      const t = format.true || "True"
      const f = format.false || "False"

      if (format.style == "text") {
        return value ? t : f
      } else if (format.style == "badge") {
        return `<span class="rest-scaffold-badge ${
          value ? "rest-scaffold-badge-success" : "rest-scaffold-badge-error"
        }">${value ? t : f}</span>`
      }
    }

    // Default to a checkbox.
    return this.htmlSafe(
      `<input disabled="disabled" type="checkbox" ${value ? "checked" : ""}></input>`,
    )
  }

  formatDate(value, { format } = {}) {
    format ||= this.dateFormat

    return new Date(value).toLocaleDateString(undefined, format || undefined)
  }

  formatTime(value, { format } = {}) {
    format ||= this.timeFormat

    return new Date(`2000-01-01T${value}Z`).toLocaleTimeString(undefined, format)
  }

  formatDateTime(value, { format } = {}) {
    format ||= this.dateTimeFormat

    if (format == "utc") {
      return new Date(value).toUTCString()
    } else if (format) {
      return new Intl.DateTimeFormat(undefined, format).format(value)
    }

    return new Date(value).toLocaleString()
  }

  formatNumber(value, { format } = {}) {
    format ||= this.numberFormat

    if (format) {
      return new Intl.NumberFormat(undefined, format).format(value)
    }

    return Number(value).toLocaleString()
  }

  // Render a record's field according to the field configuration
  render(record, field) {
    const fcfg = this.fieldConfig[field]

    if (fcfg.render) {
      return this.escape(fcfg.render(record, { config: this }))
    }

    const value = record[field]

    if (fcfg.type == "boolean") {
      return this.formatBoolean(value, { format: fcfg.format })
    } else if (fcfg.type == "date") {
      return this.formatDate(value, { format: fcfg.format })
    } else if (fcfg.type == "time") {
      return this.formatTime(value, { format: fcfg.format })
    } else if (fcfg.type == "datetime") {
      return this.formatDateTime(value, { format: fcfg.format })
    } else if (fcfg.type == "number") {
      return this.formatNumber(value, { format: fcfg.format })
    }

    // Implicit `string` type.
    return this.escape(value)
  }

  // Render a record's field for a detail view.
  renderDetail(record, field) {
    const fcfg = this.fieldConfig[field]

    if (fcfg.renderDetail) {
      return this.escape(fcfg.renderDetail(record, { config: this }))
    } else if (fcfg.render) {
      return this.escape(fcfg.render(record, { config: this }))
    }

    return this.render(record, field)
  }

  // Render an HTML input for a record's field, given an optional initial value.
  renderInput(field, { record }) {
    const fcfg = this.fieldConfig[field]

    if (fcfg.renderInput) {
      return fcfg.renderInput(value)
    }

    return `<input type="text" value="${value || ""}" />`
  }
}
